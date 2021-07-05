import { calls, MockResponseObject, post, reset } from "fetch-mock";
import { Endpoint } from "../../src/util/endpoints";
import { doLogin, getAuthToken, isLoggedIn } from "../../src/util/auth";
import { expect } from "chai";
import base64url from "base64url";
import jwt_decode from "jwt-decode";
import {
    getAccessToken,
    IAPIToken,
    setAccessToken,
    setRefreshToken,
} from "../../src/util/internal/tokens";
import { testKeyValStorage } from "../testSetup";
import { describe } from "mocha";

const correctUsername = "user";
const correctPassword = "password";

const jwtJoseHeader: string = base64url.encode(
    JSON.stringify({
        typ: "JWT",
        alg: "HS256",
    })
);

// just a static signature because we don't verify the signatures
const fakeJwsSignature = "ktkMgaQJFU83ds642P+8fMBv9UqhEQW3oVUkIlE/0PA";

/**
 * Creates a fake token for testing
 *
 * @see https://datatracker.ietf.org/doc/html/rfc7519
 * @param tokenType Access or refresh
 * @param expireNow Whether to create an already-expired token
 */
const createFakeToken = (tokenType: "access" | "refresh", expireNow: boolean): string => {
    const jwtClaimsSet: string = base64url.encode(
        JSON.stringify({
            token_type: tokenType,
            exp: expireNow ? 1000 : Date.now() / 1000 + 120,
            jti: "97cf729673794d518c82240f3b59ee47",
            user_id: 1,
        } as IAPIToken)
    );

    return jwtJoseHeader + "." + jwtClaimsSet + "." + fakeJwsSignature;
};

const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

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
            expect(await doLogin(correctUsername, correctPassword + "wrong")).equal(false);
            expect(await isLoggedIn()).equal(false);
        });
        it("returns true if login succeeds", async () => {
            expect(await doLogin(correctUsername, correctPassword)).equal(true);
            expect(await isLoggedIn()).equal(true);
        });
    });

    describe("getAuthToken", () => {
        it("doesn't refresh tokens when all tokens valid", async () => {
            expect(testKeyValStorage.size).equal(0);
            await setAccessToken(createFakeToken("access", false));
            await setRefreshToken(createFakeToken("refresh", false));

            const newAccessToken = await getAuthToken();
            expect(newAccessToken).not.null;
            expect(await getAccessToken()).equal(newAccessToken);

            expect(calls().length).equal(0);
        });

        it("refreshes expired access token when we have valid refresh token", async () => {
            expect(testKeyValStorage.size).equal(0);
            await setAccessToken(createFakeToken("access", true));
            await setRefreshToken(createFakeToken("refresh", false));

            const newAccessToken = await getAuthToken();
            expect(newAccessToken).not.null;
            expect(await getAccessToken()).equal(newAccessToken);
            expect((jwt_decode(newAccessToken as string) as IAPIToken).exp).greaterThan(
                Date.now() / 1000
            );

            expect(calls().length).equal(1);
            const [endpoint] = calls()[0];
            expect(endpoint).matches(RegExp(`^.*${Endpoint.LOGIN_REFRESH}$`));
        });

        it("fails to refreshes tokens when we have invalid refresh token", async () => {
            expect(testKeyValStorage.size).equal(0);
            await setAccessToken(createFakeToken("access", true));
            await setRefreshToken(createFakeToken("refresh", true));

            const newAccessToken = await getAuthToken();
            expect(newAccessToken).null;
            expect(calls().length).equal(0);
        });

        it("doesn't excessively refresh tokens on multiple async API calls", async () => {
            expect(testKeyValStorage.size).equal(0);
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
            expect(calls().length).equal(1);
            const [endpoint] = calls()[0];
            expect(endpoint).matches(RegExp(`^.*${Endpoint.LOGIN_REFRESH}$`));

            // All of the API calls should be using the same access token.
            const expectedToken = await getAccessToken();
            for (const token of allAccessTokens) {
                expect(token).equals(expectedToken);
            }
        });
    });
});
