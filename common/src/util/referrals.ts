import i18n from "i18next";

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

// On language change, recompute arrays of labels
export var prostheticInjuryLocations: { [key: string]: string } = {};
export var orthoticInjuryLocations: { [key: string]: string } = {};
export var otherServices: { [key: string]: string } = {};
export var wheelchairExperiences: { [key: string]: string } = {};
export var mentalHealthConditions: { [key: string]: string } = {};
const refreshArrays = () => {
    prostheticInjuryLocations = {
        [InjuryLocation.BELOW_KNEE]: i18n.t("referral.belowKnee"),
        [InjuryLocation.ABOVE_KNEE]: i18n.t("referral.aboveKnee"),
        [InjuryLocation.BELOW_ELBOW]: i18n.t("referral.belowElbow"),
        [InjuryLocation.ABOVE_ELBOW]: i18n.t("referral.aboveElbow"),
    };

    orthoticInjuryLocations = {
        [orthoticInjury.WEAK_LEG]: i18n.t("referral.weakLeg"),
        [orthoticInjury.CEREBRAL_PALSY]: i18n.t("referral.cerebralPalsy"),
        [orthoticInjury.SPINA_BIFIDA]: i18n.t("referral.spinaBifida"),
        [orthoticInjury.CLUB_FOOT]: i18n.t("referral.clubFoot"),
        [orthoticInjury.INJECTION_NEURITIS]: i18n.t("referral.injectionNeuritis"),
        [orthoticInjury.DROP_FOOT]: i18n.t("referral.dropFoot"),
        [orthoticInjury.POLIO]: i18n.t("referral.polio"),
        [orthoticInjury.OTHER]: i18n.t("referral.other"),
    };

    otherServices = {
        [Impairments.VISUAL_IMPAIRMENT]: i18n.t("referral.visualImpairment"),
        [Impairments.HEARING_IMPAIRMENT]: i18n.t("referral.hearingImpairment"),
        [Impairments.SAFEGUARDING]: i18n.t("referral.safeguarding"),
        [Impairments.OTHER]: i18n.t("referral.other"),
    };

    wheelchairExperiences = {
        [WheelchairExperience.BASIC]: i18n.t("referral.basic"),
        [WheelchairExperience.INTERMEDIATE]: i18n.t("referral.intermediate"),
    };

    mentalHealthConditions = {
        [MentalConditions.AUTISM]: i18n.t("referral.autism"),
        [MentalConditions.DEMENTIA]: i18n.t("referral.dementia"),
        [MentalConditions.OTHER]: i18n.t("referral.other"),
    };
};
refreshArrays();
i18n.on("languageChanged", () => {
    refreshArrays();
});
