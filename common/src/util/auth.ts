import jwt_decode from "jwt-decode";
import { Endpoint } from "./endpoints";
import { commonConfiguration } from "../init";

const ACCESS_TOKEN_KEY = "api_accessToken";
const REFRESH_TOKEN_KEY = "api_refreshToken";

interface IAPIToken {
    token_type: "access" | "refresh";
    exp: number;
    jti: string;
    user_id: number;
}

const getAccessToken = (): Promise<string | null> => {
    return commonConfiguration.keyValStorageProvider.getItem(ACCESS_TOKEN_KEY);
};
const getRefreshToken = (): Promise<string | null> => {
    return commonConfiguration.keyValStorageProvider.getItem(REFRESH_TOKEN_KEY);
};

const setAccessToken = (token: string): Promise<void> => {
    return commonConfiguration.keyValStorageProvider.setItem(ACCESS_TOKEN_KEY, token);
};
const setRefreshToken = (token: string): Promise<void> => {
    return commonConfiguration.keyValStorageProvider.setItem(REFRESH_TOKEN_KEY, token);
};

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
const isTokenValid = (token: string | null): boolean => {
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

const requestTokens = async (
    endpoint: Endpoint.LOGIN | Endpoint.LOGIN_REFRESH,
    postBody: string
): Promise<boolean> => {
    const init: RequestInit = {
        method: "POST",
        body: postBody,
        headers: {
            "Content-Type": "application/json",
        },
    };

    try {
        const resp = await fetch(commonConfiguration.apiUrl + endpoint, init);

        if (!resp.ok) {
            throw new Error(
                `Request token failure: request failed with HTTP status ${resp.status}.`
            );
        }

        const json = await resp.json();

        if (isTokenValid(json.access) && isTokenValid(json.refresh)) {
            await setAccessToken(json.access);
            await setRefreshToken(json.refresh);
        } else {
            throw new Error(
                "Request token failure: the access and/or refresh token(s) received were invalid."
            );
        }
    } catch (e) {
        console.error(e);
        return false;
    }

    return true;
};

const refreshTokens = async (): Promise<boolean> => {
    const postBody = JSON.stringify({
        refresh: await getRefreshToken(),
    });

    return requestTokens(Endpoint.LOGIN_REFRESH, postBody);
};

export const doLogin = async (username: string, password: string): Promise<boolean> => {
    console.log("Username: ", username);
    console.log("Password: ", password);
    const postBody = JSON.stringify({
        username,
        password,
    });

    return requestTokens(Endpoint.LOGIN, postBody);
};

export const doLogout = async () => {
    await setAccessToken("");
    await setRefreshToken("");
    await commonConfiguration.logoutCallback?.();
};

/**
 * @return Whether the user's refresh token is invalid. This does not necessarily mean the user has
 * never used the app before. It could be that their refresh token has expired; on mobile, this
 * might mean they still have data.
 */
export const isLoggedIn = async (): Promise<boolean> => isTokenValid(await getRefreshToken());

/**
 * Gets the stored access token for the `Authorization: Bearer ${token}` header.
 *
 * If the access token is invalid (expired), an attempt to refresh will be made.
 * If token refreshing fails, {@link doLogout} is called iff the configured
 * {@link CommonConfiguration#shouldLogoutOnTokenRefreshFailure } setting is true.
 *
 * @return a valid access token, or `null` if unable to get a valid token or token refreshing
 * fails.
 */
export const getAuthToken = async (): Promise<string | null> => {
    if (!(await isLoggedIn())) {
        if (commonConfiguration.shouldLogoutOnTokenRefreshFailure) {
            doLogout();
        }
        return null;
    }

    if (!isTokenValid(await getAccessToken())) {
        const refreshSuccess = await refreshTokens();

        if (!refreshSuccess) {
            if (commonConfiguration.shouldLogoutOnTokenRefreshFailure) {
                doLogout();
            }
            return null;
        }
    }

    return getAccessToken();
};
