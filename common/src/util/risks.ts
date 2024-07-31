import { themeColors } from "./colors";
import i18n from "i18next";
export interface IRisk {
    id: string;
    client_id: string;
    timestamp: number;
    risk_type: RiskType;
    risk_level: RiskLevel;
    requirement: string;
    goal: string;
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
}

export interface IRiskLevel {
    name: string;
    color: string;
    level: number;
}

export const riskLevels: { [key: string]: IRiskLevel } = {
    [RiskLevel.LOW]: {
        level: 0,
        name: i18n.t("common.risks.low"),
        color: themeColors.riskGreen,
    },
    [RiskLevel.MEDIUM]: {
        level: 1,
        name: i18n.t("common.risks.medium"),
        color: themeColors.riskYellow,
    },
    [RiskLevel.HIGH]: {
        level: 4, // 1 high > 3 mediums, as specified by customer
        name: i18n.t("common.risks.high"),
        color: themeColors.riskRed,
    },
    [RiskLevel.CRITICAL]: {
        level: 13, // 1 critical > 3 highs, as specified by customer
        name: i18n.t("common.risks.critical"),
        color: themeColors.riskBlack,
    },
};

export interface IRiskType {
    name: string;
}

export const riskTypes: { [key: string]: IRiskType } = {
    [RiskType.HEALTH]: {
        name: i18n.t("common.risks.health"),
    },
    [RiskType.EDUCATION]: {
        name:  i18n.t("common.risks.education"),
    },
    [RiskType.SOCIAL]: {
        name: i18n.t("common.risks.social"),
    },
    [RiskType.NUTRITION]: {
        name: i18n.t("common.risks.nutrition"),
    },
    [RiskType.MENTAL]: {
        name: i18n.t("common.risks.mental"),
    },
};
