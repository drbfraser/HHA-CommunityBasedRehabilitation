import jwt_decode from "jwt-decode";
import { Endpoint } from "./endpoints";
import { commonConfiguration } from "./init";

const ACCESS_TOKEN_KEY = "api_accessToken";
const REFRESH_TOKEN_KEY = "api_refreshToken";

interface IAPIToken {
    token_type: "access" | "refresh";
    exp: number;
    jti: string;
    user_id: number;
}

const getAccessToken: () => Promise<string | null> = () => {
    return commonConfiguration.keyValStorageProvider.getItem(ACCESS_TOKEN_KEY);
};
const getRefreshToken: () => Promise<string | null> = () => {
    return commonConfiguration.keyValStorageProvider.getItem(REFRESH_TOKEN_KEY);
};

const setAccessToken: (token: string) => Promise<void> = (token: string) => {
    return commonConfiguration.keyValStorageProvider.setItem(ACCESS_TOKEN_KEY, token);
};
const setRefreshToken: (token: string) => Promise<void> = (token: string) => {
    return commonConfiguration.keyValStorageProvider.setItem(REFRESH_TOKEN_KEY, token);
};

// returns false if malformed or within 30 seconds of expiry
const isTokenValid = (token: string | null) => {
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

const requestTokens = async (endpoint: Endpoint, postBody: string): Promise<boolean> => {
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

const refreshTokens = async () => {
    const postBody = JSON.stringify({
        refresh: await getRefreshToken(),
    });

    return requestTokens(Endpoint.LOGIN_REFRESH, postBody);
};

export const doLogin = async (username: string, password: string): Promise<boolean> => {
    const postBody = JSON.stringify({
        username,
        password,
    });

    return requestTokens(Endpoint.LOGIN, postBody);
};

export const doLogout = () => {
    setAccessToken("");
    setRefreshToken("");
    commonConfiguration.logoutCallback?.();
};

export const isLoggedIn = async () => isTokenValid(await getRefreshToken());

export const getAuthToken = async () => {
    if (!(await isLoggedIn())) {
        doLogout();
        return null;
    }

    if (!isTokenValid(await getAccessToken())) {
        const refreshSuccess = await refreshTokens();

        if (!refreshSuccess) {
            doLogout();
            return null;
        }
    }

    return getAccessToken();
};
