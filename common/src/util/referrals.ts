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
    picture: string;
    hip_width: number;
    wheelchair_owned: boolean;
    wheelchair_repairable: boolean;
    physiotherapy: boolean;
    condition: string;
    prosthetic: boolean;
    prosthetic_injury_location: InjuryLocation;
    orthotic: boolean;
    orthotic_injury_location: orthoticInjury;

    mental_health: boolean;
    mental_health_condition: MentalConditions;
    mental_condition_other: string;

    hha_nutrition_and_agriculture_project: boolean;
    emergency_food_aid: boolean;
    agriculture_livelihood_program_enrollment: boolean;

    services_other: string;
}

export interface IOutstandingReferral {
    id: number;
    full_name: string;
    date_referred: number;
    wheelchair: boolean;
    physiotherapy: boolean;
    prosthetic: boolean;
    orthotic: boolean;
    mental_health: boolean;
    hha_nutrition_and_agriculture_project: boolean;
    emergency_food_aid: boolean;
    agriculture_livelihood_program_enrollment: boolean;
    services_other: string;
}

export enum ReferralTypes {
    WHEELCHAIR = "wheelchair",
    PROSTHETIC = "prosthetic",
    ORTHOTIC = "orthotic",
    HHANAP = "hha_nutrition_and_agriculture_project",
}

export enum InjuryLocation {
    BELOW_KNEE = "BELOW_KNEE",
    ABOVE_KNEE = "ABOVE_KNEE",
    BELOW_ELBOW = "BELOW_ELBOW",
    ABOVE_ELBOW = "ABOVE_ELBOW",
}
export enum orthoticInjury {
    WEAK_LEG = "WEAK_LEG",
    CEREBRAL_PALSY = "CEREBRAL_PALSY",
    SPINA_BIFIDA = "SPINA_BIFIDA",
    CLUB_FOOT = "CLUB_FOOT",
    INJECTION_NEURITIS = "INJECTION_NEURITIS",
    DROP_FOOT = "DROP_FOOT",
    POLIO = "POLIO",
    OTHER = "OTHER",
}

export enum Impairments {
    VISUAL_IMPAIRMENT = "Visual Impairment",
    HEARING_IMPAIRMENT = "Hearing Impairment",
    SAFEGUARDING = "Safeguarding",
    OTHER = "Other",
}

export enum WheelchairExperience {
    BASIC = "BAS",
    INTERMEDIATE = "INT",
}

export enum MentalConditions {
    AUTISM = "Autism",
    DEMENTIA = "Dementia",
    OTHER = "Other",
}

export const prostheticInjuryLocations = {
    [InjuryLocation.BELOW_KNEE]: "Below the knee",
    [InjuryLocation.ABOVE_KNEE]: "Above the knee",
    [InjuryLocation.BELOW_ELBOW]: "Below the elbow",
    [InjuryLocation.ABOVE_ELBOW]: "Above the elbow",
};

export const orthoticInjuryLocations = {
    [orthoticInjury.WEAK_LEG]: "Weak Leg",
    [orthoticInjury.CEREBRAL_PALSY]: "Cerebral Palsy",
    [orthoticInjury.SPINA_BIFIDA]: "Spina Bifida",
    [orthoticInjury.CLUB_FOOT]: "Club Foot",
    [orthoticInjury.INJECTION_NEURITIS]: "Injection Neuritis",
    [orthoticInjury.DROP_FOOT]: "Drop Foot",
    [orthoticInjury.POLIO]: "Polio",
    [orthoticInjury.OTHER]: "Other",
};

export const otherServices = {
    [Impairments.VISUAL_IMPAIRMENT]: "Visual Impairment",
    [Impairments.HEARING_IMPAIRMENT]: "Hearing Impairment",
    [Impairments.SAFEGUARDING]: "Safeguarding",
    [Impairments.OTHER]: "Other",
};

export const wheelchairExperiences = {
    [WheelchairExperience.BASIC]: "Basic",
    [WheelchairExperience.INTERMEDIATE]: "Intermediate",
};

export const mentalHealthConditions = {
    [MentalConditions.AUTISM]: "Autism",
    [MentalConditions.DEMENTIA]: "Dementia",
    [MentalConditions.OTHER]: "Other",
};
