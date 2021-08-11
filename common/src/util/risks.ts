import { themeColors } from "./colors";
export interface IRisk {
    id: number;
    client: number;
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
        name: "Low",
        color: themeColors.riskGreen,
    },
    [RiskLevel.MEDIUM]: {
        level: 1,
        name: "Medium",
        color: themeColors.riskYellow,
    },
    [RiskLevel.HIGH]: {
        level: 4, // 1 high > 3 mediums, as specified by customer
        name: "High",
        color: themeColors.riskRed,
    },
    [RiskLevel.CRITICAL]: {
        level: 13, // 1 critical > 3 highs, as specified by customer
        name: "Critical",
        color: themeColors.riskBlack,
    },
};

export interface IRiskType {
    name: string;
}

export const riskTypes: { [key: string]: IRiskType } = {
    [RiskType.HEALTH]: {
        name: "Health",
    },
    [RiskType.EDUCATION]: {
        name: "Education",
    },
    [RiskType.SOCIAL]: {
        name: "Social",
    },
};

export interface IRiskType {
    name: string;
}
