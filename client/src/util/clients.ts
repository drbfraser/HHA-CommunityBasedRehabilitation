import { IRisk } from "./risks";

export interface IClient {
    id: number;
    first_name: string;
    last_name: string;
    birth_date: number;
    gender: Gender;
    phone_number: string;
    created_by_user: number;
    created_date: number;
    longitude: string;
    latitude: string;
    zone: number;
    village: string;
    picture: unknown;
    caregiver_present: boolean;
    caregiver_phone: string;
    caregiver_email: string;
    caregiver_picture: unknown;
    risks: IRisk[];
    disability: number[];
}

export enum Gender {
    MALE = "M",
    FEMALE = "F",
}

export const genders = {
    [Gender.FEMALE]: "Female",
    [Gender.MALE]: "Male",
};
