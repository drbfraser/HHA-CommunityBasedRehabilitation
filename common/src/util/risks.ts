import { themeColors } from "./colors";
import i18n from "i18next";
import { OutcomeGoalMet } from "./visits";
export interface IRisk {
    id: string;
    client_id: string;
    timestamp: number;
    risk_type: RiskType;
    risk_level: RiskLevel;
    requirement: string;

    // replace with goal_name after
    goal: string;

    start_date: number;
    end_date: number;
    goal_name: string;
    goal_status: OutcomeGoalMet;
    cancellation_reason: string;
    change_type: RiskChangeType;
}

export enum RiskType {
    HEALTH = "HEALTH",
    EDUCATION = "EDUCAT",
    SOCIAL = "SOCIAL",
    NUTRITION = "NUTRIT",
    MENTAL = "MENTAL",
}

export enum RiskLevel {
    LOW = "LO",
    MEDIUM = "ME",
    HIGH = "HI",
    CRITICAL = "CR",
    NOT_ACTIVE = "NA",
}

export enum RiskChangeType {
    INITIAL = "INIT",
    RISK_LEVEL = "RL",
    GOAL_STATUS = "GS",
    BOTH = "BOTH",
    OTHER = "OTH",
}

export interface IRiskLevel {
    name: string;
    color: string;
    level: number;
    isDropDownOption: boolean;
}
export interface IRiskType {
    name: string;
}

export interface IGoalStatus {
    name: string;
    color: string;
}

// On language change, recompute arrays of labels
export let riskLevels: { [key: string]: IRiskLevel } = {};
export let riskTypes: { [key: string]: IRiskType } = {};
export let goalStatuses: { [key: string]: IGoalStatus } = {};
const refreshArrays = () => {
    riskLevels = {
        [RiskLevel.NOT_ACTIVE]: {
            level: 0,
            // TODO: need translation for this
            name: "Not Active",
            color: themeColors.borderGray,
            isDropDownOption: false,
        },
        [RiskLevel.LOW]: {
            level: 1,
            name: i18n.t("risks.low"),
            color: themeColors.riskGreen,
            isDropDownOption: true,
        },
        [RiskLevel.MEDIUM]: {
            level: 2,
            name: i18n.t("risks.medium"),
            color: themeColors.riskYellow,
            isDropDownOption: true,
        },
        [RiskLevel.HIGH]: {
            level: 7, // 1 high > 3 mediums, as specified by customer
            name: i18n.t("risks.high"),
            color: themeColors.riskRed,
            isDropDownOption: true,
        },
        [RiskLevel.CRITICAL]: {
            level: 22, // 1 critical > 3 highs, as specified by customer
            name: i18n.t("risks.critical"),
            color: themeColors.riskBlack,
            isDropDownOption: true,
        },
    };

    riskTypes = {
        [RiskType.HEALTH]: {
            name: i18n.t("risks.health"),
        },
        [RiskType.EDUCATION]: {
            name: i18n.t("risks.education"),
        },
        [RiskType.SOCIAL]: {
            name: i18n.t("risks.social"),
        },
        [RiskType.NUTRITION]: {
            name: i18n.t("risks.nutrition"),
        },
        [RiskType.MENTAL]: {
            name: i18n.t("risks.mental"),
        },
    };

    goalStatuses = {
        [OutcomeGoalMet.CANCELLED]: {
            name: i18n.t("newVisit.cancelled"),
            color: themeColors.goalRed,
        },
        [OutcomeGoalMet.ONGOING]: {
            name: i18n.t("newVisit.ongoing"),
            color: themeColors.goalBlue,
        },
        [OutcomeGoalMet.CONCLUDED]: {
            name: i18n.t("newVisit.PLACEHOLDER-socialGoals.0"),
            color: themeColors.goalGreen,
        },
        [OutcomeGoalMet.NOTSET]: {
            name: i18n.t("newVisit.PLACEHOLDER-socialGoals.3"),
            color: themeColors.goalBlue,
        },
    };
};
refreshArrays();
i18n.on("languageChanged", () => {
    refreshArrays();
});

export const getRiskRequirementsTranslationKey = (riskType: RiskType) => {
    // TODO: Use real values for requirements. Current values are only placeholders
    switch (riskType) {
        case RiskType.SOCIAL:
            return "newVisit.PLACEHOLDER-socialRequirements";
        case RiskType.HEALTH:
            return "newVisit.PLACEHOLDER-healthRequirements";
        case RiskType.MENTAL:
            return "newVisit.PLACEHOLDER-mentalRequirements";
        case RiskType.NUTRITION:
            return "newVisit.PLACEHOLDER-nutritionRequirements";
        case RiskType.EDUCATION:
            return "newVisit.PLACEHOLDER-educationRequirements";
        default:
            console.error("unknown risk type:", riskType);
            return "general.unknown";
    }
};

export const getRiskGoalsTranslationKey = (riskType: RiskType) => {
    // TODO: Use real values for requirements. Current values are only placeholders
    switch (riskType) {
        case RiskType.SOCIAL:
            return "newVisit.PLACEHOLDER-socialGoals";
        case RiskType.HEALTH:
            return "newVisit.PLACEHOLDER-healthGoals";
        case RiskType.MENTAL:
            return "newVisit.PLACEHOLDER-mentalGoals";
        case RiskType.NUTRITION:
            return "newVisit.PLACEHOLDER-nutritionGoals";
        case RiskType.EDUCATION:
            return "newVisit.PLACEHOLDER-educationGoals";
        default:
            console.error("unknown risk type:", riskType);
            return "general.unknown";
    }
};
