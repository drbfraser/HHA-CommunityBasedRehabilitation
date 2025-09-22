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
                Malaria: i18n.t("risk.healthRequirementMalaria"),
                Medical: i18n.t("risk.healthRequirementMedical"),
                Wound: i18n.t("risk.healthRequirementWound"),
                Mobility: i18n.t("risk.healthRequirementMobility"),
                Physiotherapy: i18n.t("risk.healthRequirementPhysiotherapy"),
            },
            goal: {
                Medical: i18n.t("risk.healthGoalMedical"),
                Sores: i18n.t("risk.healthGoalSores"),
                Mobility: i18n.t("risk.healthGoalMobility"),
                Pain: i18n.t("risk.healthGoalPain"),
            },
        },
        social: {
            requirement: {
                Contact: i18n.t("risk.socialRequirementContact"),
                Inclusion: i18n.t("risk.socialRequirementInclusion"),
                Training: i18n.t("risk.socialRequirementTraining"),
            },
            goal: {
                Community: i18n.t("risk.socialGoalCommunity"),
                Inclusion: i18n.t("risk.socialGoalInclusion"),
            },
        },
        nutrition: {
            requirement: {
                Diabetic: i18n.t("risk.nutritionRequirementDiabetic"),
                Allergies: i18n.t("risk.nutritionRequirementAllergies"),
                Malnutrition: i18n.t("risk.nutritionRequirementMalnutrition"),
                Training: i18n.t("risk.nutritionRequirementTraining"),
                Agricultural: i18n.t("risk.nutritionRequirementAgricultural"),
            },
            goal: {
                ManageDiet: i18n.t("risk.nutritionGoalManageDiet"),
                Sustainable: i18n.t("risk.nutritionGoalSustainable"),
            },
        },
        education: {
            requirement: {
                School: i18n.t("risk.educationRequirementSchool"),
                Vocational: i18n.t("risk.educationRequirementVocational"),
                Family: i18n.t("risk.educationRequirementFamily"),
            },
            goal: {
                Education: i18n.t("risk.educationGoalEducation"),
                Income: i18n.t("risk.educationGoalIncome"),
                Child: i18n.t("risk.educationGoalChild"),
            },
        },
        mental: {
            requirement: {
                Medical: i18n.t("risk.mentalRequirementMedical"),
                Family: i18n.t("risk.mentalRequirementFamily"),
                Community: i18n.t("risk.mentalRequirementCommunity"),
                Refer: i18n.t("risk.mentalRequirementRefer"),
                CounsellingStressTrauma: i18n.t("risk.mentalRequirementCounsellingStressTrauma"),
                CounsellingOther: i18n.t("risk.mentalRequirementCounsellingOther"),
            },
            goal: {
                Family: i18n.t("risk.mentalGoalFamily"),
                Community: i18n.t("risk.mentalGoalCommunity"),
                Medical: i18n.t("risk.mentalGoalMedical"),
                Agency: i18n.t("risk.mentalGoalAgency"),
                Improvement: i18n.t("risk.mentalGoalImprovement"),
                Reduction: i18n.t("risk.mentalGoalReduction"),
                Improvements: i18n.t("risk.mentalGoalImprovements"),
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
