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

export interface IPriorityLevel {
    name: string;
    color: string;
    level: number;
}

// On language change, recompute arrays of labels
export let priorities: { [key: string]: string } = {};
export let priorityLevels: { [key: string]: IPriorityLevel } = {};
const refreshArrays = () => {
    priorities = {
        [PriorityLevel.HIGH]: i18n.t("alerts.high"),
        [PriorityLevel.MEDIUM]: i18n.t("alerts.medium"),
        [PriorityLevel.LOW]: i18n.t("alerts.low"),
    };
    priorityLevels = {
        [PriorityLevel.LOW]: {
            level: 0,
            name: i18n.t("alerts.low"),
            color: themeColors.riskGreen,
        },
        [PriorityLevel.MEDIUM]: {
            level: 1,
            name: i18n.t("alerts.medium"),
            color: themeColors.riskYellow,
        },
        [PriorityLevel.HIGH]: {
            level: 4,
            name: i18n.t("alerts.high"),
            color: themeColors.riskRed,
        },
    };
};
refreshArrays();
i18n.on("languageChanged", () => {
    refreshArrays();
});
