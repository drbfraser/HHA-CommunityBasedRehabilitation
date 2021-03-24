export interface IReferral {
    id: number;
    user: number;
    client: number;
    date_referred: number;
    date_resolved: number;
    resolved: boolean;
    outcome: string;
    wheelchair: boolean;
    wheelchair_experience: WheelchairExperience;
    hip_width: number;
    wheelchair_owned: boolean;
    wheelchair_repairable: boolean;
    physiotherapy: boolean;
    condition: string;
    prosthetic: boolean;
    prosthetic_injury_location: InjuryLocation;
    orthotic: boolean;
    orthotic_injury_location: InjuryLocation;
    services_other: string;
}

export enum InjuryLocation {
    BELOW = "BEL",
    ABOVE = "ABO",
}

export enum WheelchairExperience {
    BASIC = "BAS",
    INTERMEDIATE = "INT",
}
