export interface IAlert {
    subject: string;
    priority: Priority;
    alert_message: string;
}

export enum Priority {
    HIGH = "H",
    MEDIUM = "M",
    LOW = "L",
}

export const priorities = {
    [Priority.HIGH]: "High",
    [Priority.MEDIUM]: "Medium",
    [Priority.LOW]: "Low",
};
