import { getAuthToken } from "./auth";

export const API_URL =
    process.env.NODE_ENV === "development"
        ? `http://${window.location.hostname}:8000/api/`
        : "/api/";

export enum Endpoint {
    LOGIN = "login",
    LOGIN_REFRESH = "login/refresh",
    CLIENTS = "clients",
}

export const apiFetch = async (
    endpoint: Endpoint,
    urlParams: string = "",
    customInit: RequestInit = {}
): Promise<Response> => {
    const url = API_URL + endpoint + urlParams;
    const authToken = await getAuthToken();

    const init = {
        ...customInit,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
            ...customInit.headers,
        },
    };

    return fetch(url, init).then(async (resp) => {
        if (!resp.ok) {
            const msg = "API Fetch failed with HTTP Status " + resp.status;
            console.error(msg);
            return Promise.reject(msg);
        }

        return resp;
    });
};
