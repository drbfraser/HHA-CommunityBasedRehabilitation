import { IReferral } from "./referrals";
import { IRisk, riskLevels } from "./risks";
import { ISurvey } from "./survey";
import { IVisitSummary } from "./visits";
import i18n from "i18next";

export interface IClientSummary {
    id: number;
    full_name: string;
    zone: number;
    health_risk_level: string;
    educat_risk_level: string;
    social_risk_level: string;
    nutrit_risk_level: string;
    mental_risk_level: string;
    last_visit_date: number;
    user_id: number;
    is_active: boolean;
}

export interface IClient {
    id: string;
    first_name: string;
    last_name: string;
    birth_date: number | string;
    gender: Gender;
    phone_number: string;
    disability: number[];
    other_disability: string;
    user_id: number;
    created_at: number;
    updated_at: number;
    longitude: string;
    latitude: string;
    zone: number;
    village: string;
    picture: string;
    caregiver_present: boolean;
    caregiver_name: string;
    caregiver_phone: string;
    caregiver_email: string;
    risks: IRisk[];
    visits: IVisitSummary[];
    referrals: IReferral[];
    baseline_surveys: ISurvey[];
    is_active: boolean;
}

export enum Gender {
    MALE = "M",
    FEMALE = "F",
}

export enum SortOptions {
    ID = "id",
    NAME = "name",
    ZONE = "zone",
    HEALTH = "health",
    EDUCATION = "education",
    SOCIAL = "social",
    NUTRITION = "nutrition",
    MENTAL = "mental",
}

export const genders = {
    [Gender.FEMALE]: i18n.t("clientFields.female"),
    [Gender.MALE]: i18n.t("clientFields.male"),
};

export const clientPrioritySort = (a: IClientSummary, b: IClientSummary) => {
    const getCombinedRisk = (c: IClientSummary) =>
        [
            c.health_risk_level,
            c.educat_risk_level,
            c.social_risk_level,
            c.nutrit_risk_level,
            c.mental_risk_level,
        ].reduce((sum, r) => sum + riskLevels[r].level, 0);

    const riskA = getCombinedRisk(a);
    const riskB = getCombinedRisk(b);

    if (riskA !== riskB) {
        // sort risks descending
        return riskB - riskA;
    }

    // if they have the same risk, sort by visit dates ascending (oldest first)
    return a.last_visit_date - b.last_visit_date;
};

export const appendPicture = async (
    formData: FormData,
    pictureUrl: string,
    clientId: string | undefined | null
) => {
    const clientProfilePictureFetch = await fetch(pictureUrl);
    const contentType = clientProfilePictureFetch.headers.get("Content-Type");

    // If needed, fall back to PNG so that the upload can continue; the server will figure out the
    // image type. The cropper library by default makes PNGs anyway.
    const imageExtension = contentType?.includes("image/")
        ? contentType
              .split(";")
              .find((value) => value.includes("image/"))
              ?.trim()
              ?.split("/")[1]
        : "png";

    formData.append(
        "picture",
        await clientProfilePictureFetch.blob(),
        clientId ? `client-${clientId}.${imageExtension}` : `client-new.${imageExtension}`
    );
};
