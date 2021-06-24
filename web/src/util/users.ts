// TODO: Use @cbr/common's file instead of duplicating here
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
