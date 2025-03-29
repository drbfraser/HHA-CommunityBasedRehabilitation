import { HCRType } from "./clients";

export type DemographicTypes =
    | "female_adult_total"
    | "male_adult_total"
    | "female_child_total"
    | "male_child_total";

export type StatsVisitCategory = "health" | "educat" | "social" | "nutrit" | "mental";
export type StatsReferralCategory =
    | "wheelchair"
    | "physiotherapy"
    | "prosthetic"
    | "orthotic"
    | "nutrition_agriculture"
    | "mental_health"
    | "other";

type GenerateDemographicCategoryFields<T extends string> = {
    [K in T as `${K}_${DemographicTypes}`]: number;
};

interface IBaseDisability {
    disability_id: number;
}

interface IClientBreakdown {
    zone_id: number;
    total: number;
    female_adult_total: number;
    male_adult_total: number;
    female_child_total: number;
    male_child_total: number;
    hcr_type: string;
}

export interface IStatsVisit extends GenerateDemographicCategoryFields<StatsVisitCategory> {
    zone_id: number;
    total: number;
    hcr_type: string;
}

export interface IStatsReferral extends GenerateDemographicCategoryFields<StatsReferralCategory> {
    zone_id: number;
    total: number;
    hcr_type: string;
}

export interface IStatsDisability extends IBaseDisability, IClientBreakdown {}
export interface IStatsFollowUpVisits extends IClientBreakdown {}
export interface IStatsNewClients extends IClientBreakdown {}

export interface IStats {
    disabilities: IStatsDisability[];
    clients_with_disabilities: number;
    visits: IStatsVisit[];
    referrals_unresolved: IStatsReferral;
    referrals_resolved: IStatsReferral;
    new_clients: IStatsNewClients[];
    follow_up_visits: IStatsFollowUpVisits[];
}
