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
}

export interface IStatsReferral {
    total: number;
    wheelchair_count: number;
    physiotherapy_count: number;
    prosthetic_count: number;
    orthotic_count: number;
    other_count: number;
}

export interface IStats {
    disabilities: IStatsDisability[];
    clients_with_disabilities: number;
    visits: IStatsVisit[];
    referrals_unresolved: IStatsReferral;
    referrals_resolved: IStatsReferral;
}
