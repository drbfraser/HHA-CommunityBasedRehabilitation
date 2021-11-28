export interface IAlert {
    id: string;
    subject: string;
    priority: Priority;
    alert_message: string;
    unread_by_users: string;
    created_by_user: string;
    created_date: string;
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
