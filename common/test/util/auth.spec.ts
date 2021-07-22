import {
    calls as mockedCalls,
    MockResponseObject,
    post as mockPost,
    reset as resetMockedCalls,
} from "fetch-mock";
import { Endpoint } from "../../src/util/endpoints";
import { doLogin, doLogout, getAuthToken, isLoggedIn } from "../../src/util/auth";
import jwt_decode from "jwt-decode";
import {
    getAccessToken,
    getRefreshToken,
    IAPIToken,
    setAccessToken,
    setRefreshToken,
} from "../../src/util/internal/tokens";
import { testCommonConfig, testKeyValStorage } from "../testHelpers/testCommonConfiguration";
import { addValidTokens, createFakeToken } from "../testHelpers/authTokenHelpers";
import { reinitializeCommon } from "../../src/init";
import { sleep } from "../../src/util/sleep";

const correctUsername = "user";
const correctPassword = "password";

enum RefreshErrorReason {
    NO_ERROR,
    HTTP_ERROR_500,
    SEND_EXPIRED_TOKENS,
    SEND_BADLY_FORMATTED_TOKENS,
    REFRESH_TOKEN_EXPIRED,
}

let refreshEndpointError = RefreshErrorReason.NO_ERROR;
let delayRefreshEndpoint = false;

beforeEach(() => {
    refreshEndpointError = RefreshErrorReason.NO_ERROR;
    delayRefreshEndpoint = false;

    // reset mocks and mock call history
    resetMockedCalls();
    mockPost(
        Endpoint.LOGIN,
        async (url: string, opts: RequestInit): Promise<MockResponseObject> => {
            const { username, password } = JSON.parse(opts.body as string);

            if (username === correctUsername && password === correctPassword) {
                return {
                    status: 200,
                    body: {
                        refresh: createFakeToken("refresh", false),
                        access: createFakeToken("access", false),
                    },
                };
            } else {
                return {
                    status: 401,
                };
            }
        }
    );
    mockPost(
        Endpoint.LOGIN_REFRESH,
        async (url: string, opts: RequestInit): Promise<MockResponseObject> => {
            const { refresh } = JSON.parse(opts.body as string);
            const token: IAPIToken = jwt_decode(refresh);

            // delay so that we can test multiple refresh attempts
            if (delayRefreshEndpoint) {
                await sleep(45);
            }

            if (refreshEndpointError === RefreshErrorReason.HTTP_ERROR_500) {
                return {
                    status: 500,
                };
            }

            if (token.exp > Date.now() / 1000) {
                const shouldSendExpiredTokens =
                    refreshEndpointError === RefreshErrorReason.SEND_EXPIRED_TOKENS;
                const body =
                    refreshEndpointError === RefreshErrorReason.SEND_BADLY_FORMATTED_TOKENS
                        ? {
                              refresh: "notAnActual.refreshToken.yes",
                              access: "notAnActual.accessToken.yes",
                          }
                        : {
                              refresh: createFakeToken("refresh", shouldSendExpiredTokens),
                              access: createFakeToken("access", shouldSendExpiredTokens),
                          };

                return {
                    status: 200,
                    body: body,
                };
            } else {
                return {
                    status: 401,
                };
            }
        }
    );
});

describe("auth.ts", () => {
    describe("doLogin", () => {
        it("returns false if login fails", async () => {
            try {
                await doLogin(correctUsername, correctPassword + "wrong");
                expect(false).toBe("expected doLogin to throw an error, but it didn't");
            } catch (e) {
                // good
            }
            expect(await isLoggedIn()).toEqual(false);
        });
        it("returns true if login succeeds", async () => {
            try {
                await doLogin(correctUsername, correctPassword);
            } catch (e) {
                expect(false).toBe("expected doLogin to not throw an error, but it did");
            }
            expect(await isLoggedIn()).toEqual(true);
        });
    });

    describe("doLogout", () => {
        it("should work", async () => {
            const mockLogoutCallback = jest.fn(() => {});
            expect(mockLogoutCallback).toBeCalledTimes(0);
            reinitializeCommon({
                ...testCommonConfig,
                logoutCallback: async () => mockLogoutCallback(),
            });

            try {
                await doLogin(correctUsername, correctPassword);
            } catch (e) {
                expect(false).toBe("expected not to throw an error");
            }
            expect(await isLoggedIn()).toEqual(true);
            expect(await getAccessToken()).not.toBeNull();
            expect(await getRefreshToken()).not.toBeNull();

            await doLogout();
            expect(mockLogoutCallback).toBeCalledTimes(1);

            expect(await isLoggedIn()).toEqual(false);
            expect(await getAccessToken()).toBeNull();
            expect(await getRefreshToken()).toBeNull();
        });
    });

    describe("getAuthToken", () => {
        interface GetAuthTokenRefreshTestSpec {
            shouldLogoutOnTokenRefreshFailure: boolean;
            refreshErrorReason: RefreshErrorReason;
            expectLoggedIn: boolean;
            expectTokensPresent: boolean;
        }

        const testGetAuthTokenAutoRefreshFailure = async (spec: GetAuthTokenRefreshTestSpec) => {
            expect(spec.refreshErrorReason).not.toBe(RefreshErrorReason.NO_ERROR);
            expect(testKeyValStorage.size).toEqual(0);
            expect(mockedCalls().length).toEqual(0);
            reinitializeCommon({
                ...testCommonConfig,
                shouldLogoutOnTokenRefreshFailure: spec.shouldLogoutOnTokenRefreshFailure,
            });
            refreshEndpointError = spec.refreshErrorReason;

            await setAccessToken(createFakeToken("access", true));
            await setRefreshToken(
                createFakeToken(
                    "refresh",
                    spec.refreshErrorReason == RefreshErrorReason.REFRESH_TOKEN_EXPIRED
                )
            );

            // Since we're testing getAuthToken's automatic token refreshing, we expect this to
            // always return null since refresh is assumed to fail.
            const expectedNullToken = await getAuthToken();
            expect(expectedNullToken).toBeNull();

            const expectedCalls =
                spec.refreshErrorReason == RefreshErrorReason.REFRESH_TOKEN_EXPIRED ? 0 : 1;
            expect(mockedCalls().length).toEqual(expectedCalls);

            expect(await isLoggedIn()).toBe(spec.expectLoggedIn);

            if (spec.expectTokensPresent) {
                expect(await getAccessToken()).not.toBeNull();
                expect(await getRefreshToken()).not.toBeNull();
            } else {
                expect(await getAccessToken()).toBeNull();
                expect(await getRefreshToken()).toBeNull();
            }
        };

        it("logs out if shouldLogoutOnTokenRefreshFailure and refresh is expired", async () => {
            await testGetAuthTokenAutoRefreshFailure({
                shouldLogoutOnTokenRefreshFailure: true,
                refreshErrorReason: RefreshErrorReason.REFRESH_TOKEN_EXPIRED,
                expectLoggedIn: false,
                expectTokensPresent: false,
            });
        });

        it("doesn't logout if !shouldLogoutOnTokenRefreshFailure and refresh is expired", async () => {
            await testGetAuthTokenAutoRefreshFailure({
                shouldLogoutOnTokenRefreshFailure: false,
                refreshErrorReason: RefreshErrorReason.REFRESH_TOKEN_EXPIRED,
                // should be "logged out" because refresh token is expired, but tokens haven't
                // been removed from a call to doLogout
                expectLoggedIn: false,
                expectTokensPresent: true,
            });
        });

        it("logs out if shouldLogoutOnTokenRefreshFailure, refresh token is valid, and server HTTP errors", async () => {
            await testGetAuthTokenAutoRefreshFailure({
                shouldLogoutOnTokenRefreshFailure: true,
                refreshErrorReason: RefreshErrorReason.HTTP_ERROR_500,
                expectLoggedIn: false,
                expectTokensPresent: false,
            });
        });

        it("doesn't logout if !shouldLogoutOnTokenRefreshFailure, refresh token is valid, and server HTTP errors", async () => {
            await testGetAuthTokenAutoRefreshFailure({
                shouldLogoutOnTokenRefreshFailure: false,
                refreshErrorReason: RefreshErrorReason.HTTP_ERROR_500,
                // should still be logged in
                expectLoggedIn: true,
                expectTokensPresent: true,
            });
        });

        it("logs out if shouldLogoutOnTokenRefreshFailure, refresh token is valid, and server sends expired tokens", async () => {
            await testGetAuthTokenAutoRefreshFailure({
                shouldLogoutOnTokenRefreshFailure: true,
                refreshErrorReason: RefreshErrorReason.SEND_EXPIRED_TOKENS,
                expectLoggedIn: false,
                expectTokensPresent: false,
            });
        });

        it("doesn't logout if !shouldLogoutOnTokenRefreshFailure, refresh token is valid, and server sends expired tokens", async () => {
            await testGetAuthTokenAutoRefreshFailure({
                shouldLogoutOnTokenRefreshFailure: false,
                refreshErrorReason: RefreshErrorReason.SEND_EXPIRED_TOKENS,
                // should still be logged in
                expectLoggedIn: true,
                expectTokensPresent: true,
            });
        });

        it("logs out if shouldLogoutOnTokenRefreshFailure, refresh token is valid, and server sends non-base64url tokens", async () => {
            await testGetAuthTokenAutoRefreshFailure({
                shouldLogoutOnTokenRefreshFailure: true,
                refreshErrorReason: RefreshErrorReason.SEND_BADLY_FORMATTED_TOKENS,
                expectLoggedIn: false,
                expectTokensPresent: false,
            });
        });

        it("doesn't logout if !shouldLogoutOnTokenRefreshFailure, refresh token is valid, and server sends non-base64url tokens", async () => {
            await testGetAuthTokenAutoRefreshFailure({
                shouldLogoutOnTokenRefreshFailure: false,
                refreshErrorReason: RefreshErrorReason.SEND_BADLY_FORMATTED_TOKENS,
                // should still be logged in
                expectLoggedIn: true,
                expectTokensPresent: true,
            });
        });

        it("doesn't refresh tokens when all tokens valid", async () => {
            expect(testKeyValStorage.size).toEqual(0);
            expect(mockedCalls().length).toEqual(0);

            await addValidTokens();

            const newAccessToken = await getAuthToken();
            expect(newAccessToken).not.toBeNull();
            expect(await getAccessToken()).toEqual(newAccessToken);

            expect(mockedCalls().length).toEqual(0);
        });

        it("refreshes expired access token when we have valid refresh token", async () => {
            expect(testKeyValStorage.size).toEqual(0);
            expect(mockedCalls().length).toEqual(0);

            await setAccessToken(createFakeToken("access", true));
            await setRefreshToken(createFakeToken("refresh", false));

            const newAccessToken = await getAuthToken();
            expect(newAccessToken).not.toBeNull();
            expect(await getAccessToken()).toEqual(newAccessToken);
            expect((jwt_decode(newAccessToken as string) as IAPIToken).exp).toBeGreaterThan(
                Date.now() / 1000
            );

            expect(mockedCalls().length).toEqual(1);
            const [endpoint] = mockedCalls()[0];
            expect(endpoint).toMatch(RegExp(`^.*${Endpoint.LOGIN_REFRESH}$`));
        });

        it("fails to refreshes tokens when we have invalid refresh token", async () => {
            expect(testKeyValStorage.size).toEqual(0);
            expect(mockedCalls().length).toEqual(0);

            await setAccessToken(createFakeToken("access", true));
            await setRefreshToken(createFakeToken("refresh", true));

            const newAccessToken = await getAuthToken();
            expect(newAccessToken).toBeNull();
            expect(mockedCalls().length).toEqual(0);
        });

        it("doesn't excessively refresh tokens on multiple async API calls", async () => {
            expect(testKeyValStorage.size).toEqual(0);
            expect(mockedCalls().length).toEqual(0);
            delayRefreshEndpoint = true;

            await setAccessToken(createFakeToken("access", true));
            await setRefreshToken(createFakeToken("refresh", false));

            const promises: Promise<string | null>[] = [];
            for (let i = 0; i < 200; i++) {
                // All of these should attempt to refresh because the access token is expired.
                // The mocked server has an artificial delay to ensure all of these calls attempt
                // to refresh the token.
                promises.push(getAuthToken());
            }
            const allAccessTokens = await Promise.all(promises);

            // There should only be one network call to the refresh endpoint.
            expect(mockedCalls().length).toEqual(1);
            const [endpoint] = mockedCalls()[0];
            expect(endpoint).toMatch(RegExp(`^.*${Endpoint.LOGIN_REFRESH}$`));

            // All of the API calls should be using the same access token.
            const expectedToken = await getAccessToken();
            for (const token of allAccessTokens) {
                expect(token).toEqual(expectedToken);
            }
        });
    });
});
