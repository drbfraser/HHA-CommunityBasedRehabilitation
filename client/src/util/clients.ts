import { IReferral } from "./referrals";
import { IRisk } from "./risks";
import { IVisitSummary } from "./visits";

export interface IClientSummary {
    id: number;
    full_name: string;
    zone: number;
    health_risk_level: string;
    educat_risk_level: string;
    social_risk_level: string;
    last_visit_date: number;
    created_by_user: number;
}

export interface IClient {
    id: number;
    first_name: string;
    last_name: string;
    birth_date: number | string;
    gender: Gender;
    phone_number: string;
    disability: number[];
    created_by_user: number;
    created_date: number;
    longitude: string;
    latitude: string;
    zone: number;
    village: string;
    picture: unknown;
    caregiver_present: boolean;
    caregiver_name: string;
    caregiver_phone: string;
    caregiver_email: string;
    caregiver_picture: unknown;
    risks: IRisk[];
    visits: IVisitSummary[];
    referrals: IReferral[];
}

export enum Gender {
    MALE = "M",
    FEMALE = "F",
}

export const genders = {
    [Gender.FEMALE]: "Female",
    [Gender.MALE]: "Male",
};
