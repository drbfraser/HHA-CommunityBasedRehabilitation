import { Time } from "./time";

export interface IAlert {
    id: number;
    subject: string;
    priority: PriorityLevel;
    alert_message: string;
    unread_by_users: string[];
    created_by_user: string;
    created_date: Time;
}

export enum PriorityLevel {
    LOW = "LO",
    MEDIUM = "ME",
    HIGH = "HI",
}

export const priorities = {
    [PriorityLevel.HIGH]: "High",
    [PriorityLevel.MEDIUM]: "Medium",
    [PriorityLevel.LOW]: "Low",
};

