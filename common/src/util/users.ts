import { TPasswordValues } from "../Form/UserProfile/fields";
import { FormikHelpers } from "formik";
import { apiFetch, Endpoint } from "./endpoints";

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
