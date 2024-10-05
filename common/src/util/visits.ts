import { RiskType } from "./risks";
import i18n, { TFunction } from "i18next";

export interface IVisitSummary {
    id: string;
    user_id: string;
    client_id: string;
    created_at: number;
    health_visit: boolean;
    educat_visit: boolean;
    social_visit: boolean;
    nutrit_visit: boolean;
    mental_visit: boolean;
    longitude: number;
    latitude: number;
    zone: number;
    village: number;
}

export interface IVisit {
    id: string;
    user_id: string;
    client_id: string;
    created_at: number;
    health_visit: boolean;
    educat_visit: boolean;
    social_visit: boolean;
    nutrit_visit: boolean;
    mental_visit: boolean;
    longitude: number;
    latitude: number;
    zone: number;
    village: number;
    improvements: IVisitImprovement[];
    outcomes: IVisitOutcome[];
}

export interface IVisitImprovement {
    id: string;
    visit_id: string;
    risk_type: RiskType;
    provided: string;
    desc: string;
}

export interface IVisitOutcome {
    id: string;
    visit_id: string;
    risk_type: RiskType;
    goal_met: OutcomeGoalMet;
    outcome: string;
}

export enum OutcomeGoalMet {
    CANCELLED = "CAN",
    ONGOING = "GO",
    CONCLUDED = "CON",
}

// On language change, recompute arrays of labels
export let outcomeGoalMets: { [key: string]: { [key: string]: string } } = {};
const refreshArrays = () => {
    outcomeGoalMets = {
        [OutcomeGoalMet.CANCELLED]: {
            name: i18n.t("newVisit.cancelled"),
        },
        [OutcomeGoalMet.ONGOING]: {
            name: i18n.t("newVisit.ongoing"),
        },
        [OutcomeGoalMet.CONCLUDED]: {
            name: i18n.t("newVisit.concluded"),
        },
    };
};
refreshArrays();
i18n.on("languageChanged", () => {
    refreshArrays();
});

enum Improvement {
    ADVICE = "Advice",
    ADVOCACY = "Advocacy",
    ENCOURAGEMENT = "Encouragement",
    ORTHOTIC = "Orthotic",
    PROSTHETIC = "Prosthetic",
    REFERRAL_TO_HEALTH_CENTRE = "Referral to Health Centre",
    WHEELCHAIR = "Wheelchair",
    WHEELCHAIR_REPAIRED = "Wheelchair Repair",
}
export const getTranslatedImprovementName = (t: TFunction, name: string): string => {
    const improvementNames: { [key: string]: string } = {
        [Improvement.ADVICE]: t("newVisit.advice"),
        [Improvement.ADVOCACY]: t("newVisit.advocacy"),
        [Improvement.ENCOURAGEMENT]: t("newVisit.encouragement"),
        [Improvement.ORTHOTIC]: t("newVisit.orthotic"),
        [Improvement.PROSTHETIC]: t("newVisit.prosthetic"),
        [Improvement.REFERRAL_TO_HEALTH_CENTRE]: t("newVisit.referralToHealthCentre"),
        [Improvement.WHEELCHAIR]: t("newVisit.wheelchair"),
        [Improvement.WHEELCHAIR_REPAIRED]: t("newVisit.wheelchairRepair"),
    };

    if (!improvementNames.hasOwnProperty(name)) {
        console.log(`string either has no translation or is already translated: ${name}`);
        return name;
    }
    return improvementNames[name];
};
