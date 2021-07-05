import { apiFetch, APIFetchFailError, Endpoint } from "./endpoints";

export interface IUser {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    role: UserRole;
    zone: number;
    phone_number: string;
    is_active: boolean;
}

export enum UserRole {
    ADMIN = "ADM",
    CLINICIAN = "CLN",
    WORKER = "WRK",
}

export const userRoles = {
    [UserRole.ADMIN]: {
        name: "Admin",
    },
    [UserRole.CLINICIAN]: {
        name: "Clinician",
    },
    [UserRole.WORKER]: {
        name: "Worker",
    },
};

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
