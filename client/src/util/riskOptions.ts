export interface Risk {
    name: string;
    value: string;
    color: string;
}

export const criticalRisk: Risk = {
    name: "Critical",
    value: "critical",
    color: "black",
};

export const highRisk: Risk = {
    name: "High",
    value: "high",
    color: "crimson",
};

export const mediumRisk: Risk = {
    name: "Medium",
    value: "medium",
    color: "darkorange",
};

export const lowRisk: Risk = {
    name: "Low",
    value: "low",
    color: "gray",
};

export const riskOptions = [criticalRisk, highRisk, mediumRisk, lowRisk];
