export interface IStatsDisability {
    disability_id: number;
    total: number;
}

export interface IStatsVisit {
    zone_id: number;
    total: number;
    health_count: number;
    educat_count: number;
    social_count: number;
    nutrit_count: number;
    mental_count: number;
}

export interface IStatsReferral {
    total: number;
    wheelchair_count: number;
    physiotherapy_count: number;
    prosthetic_count: number;
    orthotic_count: number;
    nutrition_agriculture_count: number;
    mental_health_count: number;
    other_count: number;
}

export interface IStatsNewClients {
    zone_id: number;
    total: number;
    female_adult_total: number;
    male_adult_total: number;
    female_child_total: number;
    male_child_total: number;
}

export interface IStatsFollowUpVisits {
    zone_id: number;
    total: number;
    female_adult_total: number;
    male_adult_total: number;
    female_child_total: number;
    male_child_total: number;
}

export interface IStats {
    disabilities: IStatsDisability[];
    clients_with_disabilities: number;
    visits: IStatsVisit[];
    referrals_unresolved: IStatsReferral;
    referrals_resolved: IStatsReferral;
    new_clients: IStatsNewClients[];
    follow_up_visits: IStatsFollowUpVisits[];
}
