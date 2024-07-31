import { themeColors } from "./colors";
import { Time } from "./time";
import i18n from "i18next";


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
    [PriorityLevel.HIGH]: i18n.t("common.alerts.high"),
    [PriorityLevel.MEDIUM]: i18n.t("common.alerts.medium"),
    [PriorityLevel.LOW]: i18n.t("common.alerts.low"),
};

export interface IPriorityLevel {
    name: string;
    color: string;
    level: number;
}

export const priorityLevels: { [key: string]: IPriorityLevel } = {
    [PriorityLevel.LOW]: {
        level: 0,
        name: i18n.t("common.alerts.low"),
        color: themeColors.riskGreen,
    },
    [PriorityLevel.MEDIUM]: {
        level: 1,
        name: i18n.t("common.alerts.medium"),
        color: themeColors.riskYellow,
    },
    [PriorityLevel.HIGH]: {
        level: 4,
        name: i18n.t("common.alerts.high"),
        color: themeColors.riskRed,
    },
};
