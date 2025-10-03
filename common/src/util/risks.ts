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
export let riskDropdownOptions: {
    [key: string]: { requirement: { [key: string]: string }; goal: { [key: string]: string } };
} = {};
export let cancellationOptions: { [key: string]: string } = {};

const refreshArrays = () => {
    riskLevels = {
        [RiskLevel.NOT_ACTIVE]: {
            level: 0,
            name: i18n.t("goals.notActive"),
            color: themeColors.noRiskGrey,
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

    // TODO: replace all of these below with translations once we have them

    cancellationOptions = {
        dead: i18n.t("cancellation.dead"),
        moved: i18n.t("cancellation.moved"),
        circumstances: i18n.t("cancellation.circumstances"),
        abandoned: i18n.t("cancellation.abandoned"),
        unwilling: i18n.t("cancellation.unwilling"),
    };

    riskDropdownOptions = {
        health: {
            requirement: {
                Malaria: i18n.t("risk.health.requirement.Malaria"),
                Medical: i18n.t("risk.health.requirement.Medical"),
                Wound: i18n.t("risk.health.requirement.Wound"),
                Mobility: i18n.t("risk.health.requirement.Mobility"),
                Physiotherapy: i18n.t("risk.health.requirement.Physiotherapy"),
            },
            goal: {
                Medical: i18n.t("risk.health.goal.Medical"),
                Sores: i18n.t("risk.health.goal.Sores"),
                Mobility: i18n.t("risk.health.goal.Mobility"),
                Pain: i18n.t("risk.health.goal.Pain"),
            },
        },
        social: {
            requirement: {
                Contact: i18n.t("risk.social.requirement.Contact"),
                Inclusion: i18n.t("risk.social.requirement.Inclusion"),
                Training: i18n.t("risk.social.requirement.Training"),
            },
            goal: {
                Community: i18n.t("risk.social.goal.Community"),
                Inclusion: i18n.t("risk.social.goal.Inclusion"),
            },
        },
        nutrition: {
            requirement: {
                Diabetic: i18n.t("risk.nutrition.requirement.Diabetic"),
                Allergies: i18n.t("risk.nutrition.requirement.Allergies"),
                Malnutrition: i18n.t("risk.nutrition.requirement.Malnutrition"),
                Training: i18n.t("risk.nutrition.requirement.Training"),
                Agricultural: i18n.t("risk.nutrition.requirement.Agricultural"),
            },
            goal: {
                ManageDiet: i18n.t("risk.nutrition.goal.ManageDiet"),
                Sustainable: i18n.t("risk.nutrition.goal.Sustainable"),
            },
        },
        education: {
            requirement: {
                School: i18n.t("risk.education.requirement.School"),
                Vocational: i18n.t("risk.education.requirement.Vocational"),
                Family: i18n.t("risk.education.requirement.Family"),
            },
            goal: {
                Education: i18n.t("risk.education.goal.Education"),
                Income: i18n.t("risk.education.goal.Income"),
                Child: i18n.t("risk.education.goal.Child"),
            },
        },
        mental: {
            requirement: {
                Medical: i18n.t("risk.mental.requirement.Medical"),
                Family: i18n.t("risk.mental.requirement.Family"),
                Community: i18n.t("risk.mental.requirement.Community"),
                Refer: i18n.t("risk.mental.requirement.Refer"),
                CounsellingStressTrauma: i18n.t("risk.mental.requirement.CounsellingStressTrauma"),
                CounsellingOther: i18n.t("risk.mental.requirement.CounsellingOther"),
            },
            goal: {
                Family: i18n.t("risk.mental.goal.Family"),
                Community: i18n.t("risk.mental.goal.Community"),
                Medical: i18n.t("risk.mental.goal.Medical"),
                Agency: i18n.t("risk.mental.goal.Agency"),
                Improvement: i18n.t("risk.mental.goal.Improvement"),
                Reduction: i18n.t("risk.mental.goal.Reduction"),
                Improvements: i18n.t("risk.mental.goal.Improvements"),
            },
        },
    };
};
refreshArrays();
i18n.on("languageChanged", () => {
    refreshArrays();
});

export const riskTypeKeyMap: Record<RiskType, string> = {
    [RiskType.HEALTH]: "health",
    [RiskType.EDUCATION]: "education",
    [RiskType.SOCIAL]: "social",
    [RiskType.NUTRITION]: "nutrition",
    [RiskType.MENTAL]: "mental",
};

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
