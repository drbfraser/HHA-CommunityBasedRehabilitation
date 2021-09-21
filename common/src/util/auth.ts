import jwt_decode from "jwt-decode";
import { APIFetchFailError, Endpoint } from "./endpoints";
import { commonConfiguration } from "../init";
import { Mutex } from "async-mutex";
import {
    deleteTokens,
    getAccessToken,
    getRefreshToken,
    IAPIToken,
    setAccessToken,
    setRefreshToken,
} from "./internal/tokens";
import rejectWithWrappedError from "./internal/rejectWithWrappedError";
import { DEFAULT_FETCH_TIMEOUT_MILLIS } from "../constants";

/**
 * Validates the given token to check if it's valid for use.
 *
 * Note: This function uses the user's local time to check for expiry. However, it's possible that
 * the user's clock can be out of sync, especially on mobile.
 *
 * @return `false` if the given token is malformed or within 30 seconds of expiry, and true if
 * the token is valid and not expired.
 * @param token The token to validate.
 */
export const isTokenValid = (token: string | null): boolean => {
    if (token === null) {
        return false;
    }

    try {
        const tokenJson: IAPIToken = jwt_decode(token);
        const timestampIn30Sec = Date.now() / 1000 + 30;
        return tokenJson.exp > timestampIn30Sec;
    } catch (e) {
        return false;
    }
};

interface AuthTokens {
    access: string;
    refresh: string;
}

/**
 * Requests fresh access and refresh tokens from the server.
 *
 * @return A Promise resolving to fresh auth tokens
 * @throws Error if unable to refresh tokens
 * @throws APIFetchFailedError if server sent not-ok HTTP response
 * @param endpoint The endpoint to use to get tokens. Which endpoint is used determines what the
 * postBody should be
 * @param postBody For `Endpoint.LOGIN`, a json string with `username` and `password` fields. For
 * `Endpoint.LOGIN_REFRESH`, a json string with a `refresh` field containing a refresh token.
 */
const requestTokens = async (
    endpoint: Endpoint.LOGIN | Endpoint.LOGIN_REFRESH,
    postBody: string
): Promise<AuthTokens> => {
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), DEFAULT_FETCH_TIMEOUT_MILLIS); // timeout value in ms

    const init: RequestInit = {
        method: "POST",
        body: postBody,
        headers: {
            "Content-Type": "application/json",
        },
        signal: abortController.signal,
    };

    try {
        const resp = await fetch(commonConfiguration.apiUrl + endpoint, init).catch(
            rejectWithWrappedError
        );

        clearTimeout(timeoutId); // clears timeout if request completes sooner

        if (!resp.ok) {
            throw new APIFetchFailError(
                `Request token failure: request failed with HTTP status ${resp.status}.`,
                resp.status,
                await resp.json().catch(() => undefined)
            );
        }

        const tokens: AuthTokens = await resp.json();
        if (isTokenValid(tokens.access) && isTokenValid(tokens.refresh)) {
            await setAccessToken(tokens.access);
            await setRefreshToken(tokens.refresh);
            return tokens;
        } else {
            throw new Error(
                "Request token failure: the access and/or refresh token(s) received were invalid."
            );
        }
    } catch (e) {
        console.error(e);
        if (e.name === "AbortError") {
            throw new Error(`The request has timed out.`);
        } else {
            throw e;
        }
    }
};

/**
 * Calls the {@link Endpoint.LOGIN_REFRESH} to refresh both the access and refresh tokens.
 * @return A Promise that resolves to fresh tokens
 * @throws Error if refreshing failed or the tokens returned aren't valid.
 */
const refreshTokens = async (): Promise<AuthTokens> => {
    const postBody = JSON.stringify({
        refresh: await getRefreshToken(),
    });

    return requestTokens(Endpoint.LOGIN_REFRESH, postBody);
};

/**
 * Logins to the server
 *
 * @return A Promise that resolves when login is successful.
 * @throws Error if unable to login
 * @throws APIFetchFailError if unable to login because server sent a not-ok HTTP response (might
 * mean username / password is wrong)
 */
export const doLogin = async (username: string, password: string): Promise<void> => {
    const postBody = JSON.stringify({
        username,
        password,
    });

    await requestTokens(Endpoint.LOGIN, postBody);
};

export const doLogout = async () => {
    await deleteTokens();
    await commonConfiguration.logoutCallback?.();
};

/**
 * @return Whether the user's refresh token is invalid. This does not necessarily mean the user has
 * never used the app before. It could be that their refresh token has expired; on mobile, this
 * might mean they still have data.
 */
export const isLoggedIn = async (): Promise<boolean> => isTokenValid(await getRefreshToken());

/**
 * For preventing excessive refreshing due to multiple async API fetches.
 */
const refreshTokenMutex = new Mutex();

/**
 * Gets the stored access token for the `Authorization: Bearer ${token}` header.
 *
 * If the access token is invalid (expired), an attempt to refresh all tokens will be made.
 * If token refreshing fails, {@link doLogout} is called iff the configured
 * {@link CommonConfiguration#shouldLogoutOnTokenRefreshFailure } setting is true.
 *
 * @return A Promise that resolves to a valid access token or `null` if unable to get a valid token
 * or token refreshing fails.
 */
export const getAuthToken = async (): Promise<string | null> => {
    if (!(await isLoggedIn())) {
        if (commonConfiguration.shouldLogoutOnTokenRefreshFailure) {
            await doLogout();
        }
        return null;
    }

    const currentAccessToken = await getAccessToken();
    if (isTokenValid(currentAccessToken)) {
        // Fast path: Just use the token if it needs no refreshing
        return currentAccessToken;
    }

    // Slow path: Potentially refresh the tokens.
    return refreshTokenMutex.runExclusive(() => {
        return getAccessToken().then((accessToken) => {
            // First check if the tokens have already been refreshed while we were blocked so that
            // we don't do unnecessary refreshes.
            if (isTokenValid(accessToken)) {
                return accessToken;
            }

            return refreshTokens()
                .then((validAuthTokens) => validAuthTokens.access)
                .catch(() => {
                    return commonConfiguration.shouldLogoutOnTokenRefreshFailure
                        ? doLogout().then(() => null)
                        : null;
                });
        });
    });
};
