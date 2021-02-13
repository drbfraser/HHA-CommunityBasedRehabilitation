import { SvgIconTypeMap } from "@material-ui/core";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import { LocalHospital, RecordVoiceOver, School } from "@material-ui/icons";

export interface IRisk {
    name: string;
    value: string;
    color: string;
    level: number;
}

export enum RiskType {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    CRITICAL = "CRITICAL",
}

export const riskOptions: { [key: string]: IRisk } = {
    [RiskType.LOW]: {
        level: 0,
        name: "Low",
        value: "low",
        color: "gray",
    },
    [RiskType.MEDIUM]: {
        level: 1,
        name: "Medium",
        value: "medium",
        color: "darkorange",
    },
    [RiskType.HIGH]: {
        level: 2,
        name: "High",
        value: "high",
        color: "crimson",
    },
    [RiskType.CRITICAL]: {
        level: 3,
        name: "Critical",
        value: "critical",
        color: "black",
    },
};

export interface IRiskCategory {
    value: string;
    Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
}

export enum RiskCategory {
    HEALTH = "Health",
    EDUCATION = "Education",
    SOCIAL = "Social",
}

export const riskCategories: { [key: string]: IRiskCategory } = {
    [RiskCategory.HEALTH]: {
        value: RiskCategory.HEALTH,
        Icon: LocalHospital,
    },
    [RiskCategory.EDUCATION]: {
        value: RiskCategory.EDUCATION,
        Icon: School,
    },
    [RiskCategory.SOCIAL]: {
        value: RiskCategory.SOCIAL,
        Icon: RecordVoiceOver,
    },
};
