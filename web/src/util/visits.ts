// TODO: Rewrite this so that it can be used in @cbr/common's and then move it there
//  Risks needs to remove its @material-ui dependency
import { RiskType } from "./risks";

export interface IVisitSummary {
    id: number;
    user: number;
    client: number;
    date_visited: number;
    health_visit: boolean;
    educat_visit: boolean;
    social_visit: boolean;
    longitude: number;
    latitude: number;
    zone: number;
    village: number;
}

export interface IVisit {
    id: number;
    user: number;
    client: number;
    date_visited: number;
    health_visit: boolean;
    educat_visit: boolean;
    social_visit: boolean;
    longitude: number;
    latitude: number;
    zone: number;
    village: number;
    improvements: IVisitImprovement[];
    outcomes: IVisitOutcome[];
}

export interface IVisitImprovement {
    id: number;
    visit: number;
    risk_type: RiskType;
    provided: string;
    desc: string;
}

export interface IVisitOutcome {
    id: number;
    visit: number;
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
        name: "Cancelled",
    },
    [OutcomeGoalMet.ONGOING]: {
        name: "Ongoing",
    },
    [OutcomeGoalMet.CONCLUDED]: {
        name: "Concluded",
    },
};
