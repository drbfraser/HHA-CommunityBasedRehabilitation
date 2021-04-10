import { getAuthToken } from "./auth";

export const API_URL =
    process.env.NODE_ENV === "development"
        ? `http://${window.location.hostname}:8000/api/`
        : "/api/";

export enum Endpoint {
    LOGIN = "login",
    LOGIN_REFRESH = "login/refresh",
    CLIENT = "client/",
    CLIENTS = "clients",
    VISITS = "visits",
    REFERRALS = "referrals",
    REFERRALS_OUTSTANDING = "referrals/outstanding",
    REFERRAL = "referral/",
    ZONES = "zones",
    USERS = "users",
    USER = "user/",
    USER_CURRENT = "user/current",
    USER_CURRENT_PASSWORD = "user/password/current",
    RISKS = "risks",
    DISABILITIES = "disabilities",
    VISIT = "visit/",
    STATS = "stats",
    BASELINE_SURVEY = "baselinesurveys",
    USER_PASSWORD = "user/password/",
}

export const APILoadError = "APILoadError";
export type TAPILoadError = typeof APILoadError;

export const apiFetch = async (
    endpoint: Endpoint,
    urlParams: string = "",
    customInit: RequestInit = {}
): Promise<Response> => {
    const url = API_URL + endpoint + urlParams;
    const authToken = await getAuthToken();
    const init: RequestInit = {
        ...customInit,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
            ...customInit.headers,
        },
    };

    if (init.body instanceof FormData) {
        delete (init.headers as any)["Content-Type"];
    }

    return fetch(url, init).then(async (resp) => {
        if (!resp.ok) {
            const msg = "API Fetch failed with HTTP Status " + resp.status;
            console.error(msg);
            return Promise.reject(msg);
        }

        return resp;
    });
};

// NOTE: This function does not handle nested objects or arrays of objects.
export const objectToFormData = (clientInfo: object) => {
    const formData = new FormData();
    Object.entries(clientInfo).forEach(([key, val]) => {
        if (Array.isArray(val)) {
            val.forEach((v) => formData.append(key, String(v)));
        } else if (typeof val === "object" && val !== null) {
            Object.entries(val).forEach(([objKey, v]) => {
                formData.append(`${key}.${objKey}`, String(v));
            });
        } else {
            formData.append(key, String(val));
        }
    });
    return formData;
};
