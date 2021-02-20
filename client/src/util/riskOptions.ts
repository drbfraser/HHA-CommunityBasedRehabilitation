import { SvgIconTypeMap } from "@material-ui/core";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import { LocalHospital, RecordVoiceOver, School } from "@material-ui/icons";
import { themeColors } from "theme.styles";

export interface IRisk {
    name: string;
    color: string;
    level: number;
}

export enum RiskType {
    LOW = "LO",
    MEDIUM = "ME",
    HIGH = "HI",
    CRITICAL = "CR",
}

export const riskOptions: { [key: string]: IRisk } = {
    [RiskType.LOW]: {
        level: 0,
        name: "Low",
        color: themeColors.riskGreen,
    },
    [RiskType.MEDIUM]: {
        level: 1,
        name: "Medium",
        color: themeColors.riskYellow,
    },
    [RiskType.HIGH]: {
        level: 2,
        name: "High",
        color: themeColors.riskRed,
    },
    [RiskType.CRITICAL]: {
        level: 3,
        name: "Critical",
        color: themeColors.riskBlack,
    },
};

export interface IRiskCategory {
    name: string;
    Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
}

export enum RiskCategory {
    HEALTH = "health_risk_level",
    EDUCATION = "educat_risk_level",
    SOCIAL = "social_risk_level",
}

export const riskCategories: { [key: string]: IRiskCategory } = {
    [RiskCategory.HEALTH]: {
        name: "Health",
        Icon: LocalHospital,
    },
    [RiskCategory.EDUCATION]: {
        name: "Education",
        Icon: School,
    },
    [RiskCategory.SOCIAL]: {
        name: "Social",
        Icon: RecordVoiceOver,
    },
};
