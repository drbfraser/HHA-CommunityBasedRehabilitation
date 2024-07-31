import { RiskType } from "./risks";
import i18n from "i18next";


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

export const outcomeGoalMets = {
    [OutcomeGoalMet.CANCELLED]: {
        name: i18n.t("common.newVisit.cancelled"),
    },
    [OutcomeGoalMet.ONGOING]: {
        name: i18n.t("common.newVisit.ongoing"),
    },
    [OutcomeGoalMet.CONCLUDED]: {
        name: i18n.t("common.newVisit.concluded"),
    },
};
