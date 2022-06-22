import { apiFetch, APIFetchFailError, Endpoint } from "./endpoints";

export interface IZone {
    zone_name: string;
}

/**
 * Updates the current user's password.
 * @return A Promise resolving to a successful response from the server.
 * @throws APIFetchFailError if the response from the server is not successful.
 */
export const updateCurrentUserPassword = async (oldPassword: string, newPassword: string) => {
    const passwordInfo = JSON.stringify({
        current_password: oldPassword,
        new_password: newPassword,
    });

    const init: RequestInit = {
        method: "PUT",
        body: passwordInfo,
    };
    return await apiFetch(Endpoint.USER_CURRENT_PASSWORD, "", init);
};

/**
 * Updates the current user's password.
 * @return A Promise resolving to a successful response from the server.
 * @throws APIFetchFailError if the response from the server is not successful.
 */
