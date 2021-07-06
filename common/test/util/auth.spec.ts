import { calls, MockResponseObject, post, reset } from "fetch-mock";
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
import { logoutCallbacks, testKeyValStorage } from "../testHelpers/testCommonConfiguration";
import { sleep } from "../testHelpers/sleep";
import { createFakeToken } from "../testHelpers/authTokenHelpers";

const correctUsername = "user";
const correctPassword = "password";

beforeEach(() => {
    reset();
    post(Endpoint.LOGIN, async (url: string, opts: RequestInit): Promise<MockResponseObject> => {
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
    }).post(
        Endpoint.LOGIN_REFRESH,
        async (url: string, opts: RequestInit): Promise<MockResponseObject> => {
            const { refresh } = JSON.parse(opts.body as string);
            const token: IAPIToken = jwt_decode(refresh);

            // delay so that we can test multiple refresh attempts
            await sleep(45);

            if (token.exp > Date.now() / 1000) {
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
});

describe("auth.ts", () => {
    describe("doLogin", () => {
        it("returns false if login fails", async () => {
            expect(await doLogin(correctUsername, correctPassword + "wrong")).toEqual(false);
            expect(await isLoggedIn()).toEqual(false);
        });
        it("returns true if login succeeds", async () => {
            expect(await doLogin(correctUsername, correctPassword)).toEqual(true);
            expect(await isLoggedIn()).toEqual(true);
        });
    });

    describe("doLogout", () => {
        it("should work", async () => {
            expect(await doLogin(correctUsername, correctPassword)).toEqual(true);
            expect(await isLoggedIn()).toEqual(true);
            expect(await getAccessToken()).not.toBeNull();
            expect(await getRefreshToken()).not.toBeNull();

            await new Promise((resolve) => {
                // Test that the logout callback works. This will timeout if the logout callback
                // isn't called.
                logoutCallbacks.push(() => {
                    resolve();
                });
                doLogout();
            });

            expect(await isLoggedIn()).toEqual(false);
            expect(await getAccessToken()).toBeNull();
            expect(await getRefreshToken()).toBeNull();
        });
    });

    describe("getAuthToken", () => {
        it("doesn't refresh tokens when all tokens valid", async () => {
            expect(testKeyValStorage.size).toEqual(0);
            await setAccessToken(createFakeToken("access", false));
            await setRefreshToken(createFakeToken("refresh", false));

            const newAccessToken = await getAuthToken();
            expect(newAccessToken).not.toBeNull();
            expect(await getAccessToken()).toEqual(newAccessToken);

            expect(calls().length).toEqual(0);
        });

        it("refreshes expired access token when we have valid refresh token", async () => {
            expect(testKeyValStorage.size).toEqual(0);
            await setAccessToken(createFakeToken("access", true));
            await setRefreshToken(createFakeToken("refresh", false));

            const newAccessToken = await getAuthToken();
            expect(newAccessToken).not.toBeNull();
            expect(await getAccessToken()).toEqual(newAccessToken);
            expect((jwt_decode(newAccessToken as string) as IAPIToken).exp).toBeGreaterThan(
                Date.now() / 1000
            );

            expect(calls().length).toEqual(1);
            const [endpoint] = calls()[0];
            expect(endpoint).toMatch(RegExp(`^.*${Endpoint.LOGIN_REFRESH}$`));
        });

        it("fails to refreshes tokens when we have invalid refresh token", async () => {
            expect(testKeyValStorage.size).toEqual(0);
            await setAccessToken(createFakeToken("access", true));
            await setRefreshToken(createFakeToken("refresh", true));

            const newAccessToken = await getAuthToken();
            expect(newAccessToken).toBeNull();
            expect(calls().length).toEqual(0);
        });

        it("doesn't excessively refresh tokens on multiple async API calls", async () => {
            expect(testKeyValStorage.size).toEqual(0);
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
            expect(calls().length).toEqual(1);
            const [endpoint] = calls()[0];
            expect(endpoint).toMatch(RegExp(`^.*${Endpoint.LOGIN_REFRESH}$`));

            // All of the API calls should be using the same access token.
            const expectedToken = await getAccessToken();
            for (const token of allAccessTokens) {
                expect(token).toEqual(expectedToken);
            }
        });
    });
});
