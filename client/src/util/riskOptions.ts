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
