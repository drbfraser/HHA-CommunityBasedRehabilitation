import { SvgIconTypeMap } from "@material-ui/core";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import { LocalHospital, RecordVoiceOver, School } from "@material-ui/icons";
import { themeColors } from "theme.styles";

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

export interface IRiskType {
    name: string;
    Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
}

export const riskTypes: { [key: string]: IRiskType } = {
    [RiskType.HEALTH]: {
        name: "Health",
        Icon: LocalHospital,
    },
    [RiskType.EDUCATION]: {
        name: "Education",
        Icon: School,
    },
    [RiskType.SOCIAL]: {
        name: "Social",
        Icon: RecordVoiceOver,
    },
};

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
        level: 2,
        name: "High",
        color: themeColors.riskRed,
    },
    [RiskLevel.CRITICAL]: {
        level: 3,
        name: "Critical",
        color: themeColors.riskBlack,
    },
};
