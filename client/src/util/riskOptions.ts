import { SvgIconTypeMap } from "@material-ui/core";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import { LocalHospital, RecordVoiceOver, School } from "@material-ui/icons";

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
        color: "#81C784",
    },
    [RiskType.MEDIUM]: {
        level: 1,
        name: "Medium",
        color: "#f0aa50",
    },
    [RiskType.HIGH]: {
        level: 2,
        name: "High",
        color: "#ef5350",
    },
    [RiskType.CRITICAL]: {
        level: 3,
        name: "Critical",
        color: "#424242",
    },
};

export interface IRiskCategory {
    name: string;
    Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
}

export enum RiskCategory {
    HEALTH = "HEALTH",
    EDUCATION = "EDUCAT",
    SOCIAL = "SOCIAL",
}

export const riskCategories: { [key: string]: IRiskCategory } = {
    [RiskCategory.HEALTH]: {
        name: "Health",
        Icon: LocalHospital,
    },
    [RiskCategory.EDUCATION]: {
        name: "Edcuation",
        Icon: School,
    },
    [RiskCategory.SOCIAL]: {
        name: "Social",
        Icon: RecordVoiceOver,
    },
};
