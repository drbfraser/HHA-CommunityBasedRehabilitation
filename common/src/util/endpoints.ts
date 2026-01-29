import { getAuthToken } from "./auth";
import { commonConfiguration } from "../init";
import buildFormErrorInternal from "./internal/buildFormError";
import rejectWithWrappedError from "./internal/rejectWithWrappedError";
import { DEFAULT_FETCH_TIMEOUT_MILLIS } from "../constants";

export enum Endpoint {
    LOGIN = "login",
    LOGIN_REFRESH = "login/refresh",
    CLIENT = "client/",
    CLIENT_PICTURE = "client/picture/",
    CLIENTS = "clients",
    VISITS = "visits",
    REFERRALS = "referrals",
    REFERRALS_OUTSTANDING = "referrals/outstanding",
    REFERRALS_ALL = "referrals/all",
    REFERRAL = "referral/",
    REFERRAL_PICTURE = "referral/picture/",
    ZONES = "zones",
    ZONE = "zone/",
    ZONE_MIGRATION = "zone_migration/",
    USERS = "users",
    USER = "user/",
    USER_CURRENT = "currentuser",
    USER_CURRENT_PASSWORD = "currentuser/password",
    RISKS = "risks",
    DISABILITIES = "disabilities",
    VISIT = "visit/",
    STATS = "stats",
    BASELINE_SURVEY = "baselinesurveys",
    USER_PASSWORD = "user/password/",
    SYNC = "sync",
    ALERTS = "alerts",
    ALERT = "alert/",
    VERSION_CHECK = "versioncheck/",
    EMAIL_SETTINGS = "email_settings",
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
     * Optional response data, which may contain an error message from the server.
     */
    readonly response?: Readonly<any>;
    /**
     * A specific error message given by the server.
     */
    readonly details?: string;

    /**
     * Workaround for instanceof not working in tests.
     * https://stackoverflow.com/questions/41719162/instanceof-custom-error-class-returning-false?noredirect=1&lq=1
     *
     * @param e The error to check whether it is an instance of {@link APIFetchFailError}
     * @return Whether the given argument is an {@link APIFetchFailError}.
     */
    static isFetchError(e: any): boolean {
        return (
            e instanceof APIFetchFailError ||
            e.name === "APIFetchFailError" ||
            e.hasOwnProperty("status")
        );
    }

    constructor(message: string, status: number, response: any | undefined) {
        super(message);
        this.status = status;
        this.response = response;

        if (response) {
            const details: any | undefined = response["details"] ?? response["detail"];
            if (details) {
                this.details = typeof details === "string" ? details : JSON.stringify(details);
            }
        }
    }

    /**
     * Builds a multi-line error message if this error resulted from a form submission. Such errors
     * from the server from invalid form input would result in the JSON response containing the
     * field names mapped to the error message for that field. If no entries can be found, the
     * default {@link message} is used.
     *
     * @param formLabels A Record that maps field names to user-friendly field labels. If this is
     * undefined or the error contains fields not covered by the Record, then the raw field name
     * will be used.
     * @return A human-readable error message as described above.
     */
    buildFormError(formLabels: Record<string, string> | undefined | null): string {
        // Delegating to an internal function, because there are issues with extending native types
        // in JavaScript apparently. Trying to use this buildFormError func in the class during
        // unit tests results in "TypeError: buildFormError is not a function"
        //  * https://stackoverflow.com/questions/33832646/extending-built-in-natives-in-es6-with-babel?noredirect=1&lq=1
        return buildFormErrorInternal(this, formLabels);
    }
}

export const createApiFetchRequest = (
    endpoint: Endpoint,
    urlParams: string = "",
    customInit?: RequestInit
) => new Request(commonConfiguration.apiUrl + endpoint + urlParams, customInit);

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
    return apiFetchByRequest(createApiFetchRequest(endpoint, urlParams), customInit);
};

export const apiFetchByRequest = async (
    request: Request,
    customInit: RequestInit
): Promise<Response> => {
    const authToken = await getAuthToken();
    if (authToken === null) {
        return Promise.reject("unable to get an access token");
    }

    request.headers.set("Authorization", `Bearer ${authToken}`);
    if (!(customInit.body instanceof FormData)) {
        request.headers.set("Content-Type", "application/json");
    }

    const abortController: AbortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), DEFAULT_FETCH_TIMEOUT_MILLIS); // timeout value in ms
    customInit.signal = abortController.signal;

    return fetch(request, customInit)
        .then(async (resp) => {
            if (!resp.ok) {
                const jsonPromise = await resp
                    .clone()
                    .json()
                    .catch(() => undefined);
                const respBodyText = await resp.clone().text();
                const message = `API Fetch failed with HTTP Status ${resp.status}`;
                console.error(message);
                // gracefully handle failed DELETE requests due to protected FKs
                if (respBodyText.includes("referenced through protected foreign keys")) {
                    clearTimeout(timeoutId);
                    return resp;
                }
                return Promise.reject(
                    new APIFetchFailError(message, resp.status, await jsonPromise)
                );
            }
            clearTimeout(timeoutId); // clears timeout if request completes sooner

            return resp;
        })
        .catch(rejectWithWrappedError);
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
