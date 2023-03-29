import { themeColors } from "./colors";
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

export interface IPriorityLevel {
    name: string;
    color: string;
    level: number;
}

export const priorityLevels: { [key: string]: IPriorityLevel } = {
    [PriorityLevel.LOW]: {
        level: 0,
        name: "Low",
        color: themeColors.riskGreen,
    },
    [PriorityLevel.MEDIUM]: {
        level: 1,
        name: "Medium",
        color: themeColors.riskYellow,
    },
    [PriorityLevel.HIGH]: {
        level: 4,
        name: "High",
        color: themeColors.riskRed,
    },
};
