import { getAuthToken } from "./auth";
import { commonConfiguration } from "../init";

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

/**
 * Represents a failed response from calling {@link apiFetch}.
 */
export class APIFetchFailError extends Error {
    /**
     * The status code from the response.
     */
    readonly status: number;
    /**
     * The response data, which may contain an error message from the server.
     */
    readonly response: Readonly<any>;

    constructor(message: string, status: number, response: any) {
        super(message);
        this.status = status;
        this.response = response;
    }
}

/**
 * Performs a fetch to the server. The returned Promise rejects on both HTTP errors and network
 * errors.
 *
 * @return A Promise that resolves to a successful {@link Response} from the server.
 * @throws APIFetchFailError if the response from the server is not successful (HTTP error).
 * @param endpoint The endpoint to fetch data from
 * @param urlParams A string to put after the API endpoint, like a number to refer to an ID. By
 * default, this is blank.
 * @param customInit An object containing any custom settings that you want to apply to the request.
 * By default, this is empty. The access token is always placed in the request headers.
 */
export const apiFetch = async (
    endpoint: Endpoint,
    urlParams: string = "",
    customInit: RequestInit = {}
): Promise<Response> => {
    const url = commonConfiguration.apiUrl + endpoint + urlParams;
    const authToken = await getAuthToken();
    if (authToken === null) {
        return Promise.reject("unable to get an access token");
    }

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
            const jsonPromise = resp.json();
            const message = `API Fetch failed with HTTP Status ${resp.status}`;
            console.error(message);
            return Promise.reject(new APIFetchFailError(message, resp.status, await jsonPromise));
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
