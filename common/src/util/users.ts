import { apiFetch, APIFetchFailError, Endpoint } from "./endpoints";
import i18n from "i18next";

export interface IUser {
    id: string;
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


// On language change, recompute arrays of labels
export var userRoles: {[key: string]: {[key:string]: string}} = {};
const refreshArrays = () => {
    userRoles = {
        [UserRole.ADMIN]: {
            name: i18n.t("users.admin"),
        },
        [UserRole.CLINICIAN]: {
            name: i18n.t("users.clinician"),
        },
        [UserRole.WORKER]: {
            name: i18n.t("users.worker"),
        },
    };
};
refreshArrays();
i18n.on("languageChanged", () => {
    refreshArrays();
}); 

export const userRolesToLabelMap: ReadonlyMap<string, string> = new Map(
    Object.entries(userRoles).map(([value, { name }]) => [value, name])
);

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
