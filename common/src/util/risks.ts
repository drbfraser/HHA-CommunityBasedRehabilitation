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
export interface IRiskType {
    name: string;
}
// On language change, recompute arrays of labels
export var riskLevels: { [key: string]: IRiskLevel } = {};
export var riskTypes: { [key: string]: IRiskType } = {};
const refreshArrays = () => {
    riskLevels = {
        [RiskLevel.LOW]: {
            level: 0,
            name: i18n.t("risks.low"),
            color: themeColors.riskGreen,
        },
        [RiskLevel.MEDIUM]: {
            level: 1,
            name: i18n.t("risks.medium"),
            color: themeColors.riskYellow,
        },
        [RiskLevel.HIGH]: {
            level: 4, // 1 high > 3 mediums, as specified by customer
            name: i18n.t("risks.high"),
            color: themeColors.riskRed,
        },
        [RiskLevel.CRITICAL]: {
            level: 13, // 1 critical > 3 highs, as specified by customer
            name: i18n.t("risks.critical"),
            color: themeColors.riskBlack,
        },
    };

    riskTypes = {
        [RiskType.HEALTH]: {
            name: i18n.t("risks.health"),
        },
        [RiskType.EDUCATION]: {
            name:  i18n.t("risks.education"),
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
};
refreshArrays();
i18n.on("languageChanged", () => {
    refreshArrays();
}); 
