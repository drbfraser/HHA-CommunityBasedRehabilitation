import * as Yup from "yup";
import { PriorityLevel, IAlert } from "../../util/alerts";
import i18n from "i18next";


export enum alertField {
    id = "id",
    subject = "subject",
    priority = "priority",
    alert_message = "alert_message",
    unread_by_users = "unread_by_users",
    created_by_user = "created_by_user",
    date_created = "date_created",
}

export const alertInitialValues = {
    [alertField.subject]: "",
    [alertField.priority]: "" as PriorityLevel,
    [alertField.alert_message]: "",
};

export type TAlertValues = typeof alertInitialValues;

// On language change, recompute arrays of labels
export var alertFieldLabels: {[key: string]: string} = {};
const refreshArrays = () => {
    alertFieldLabels = {
        [alertField.subject]: i18n.t("alerts.subject"),
        [alertField.priority]: i18n.t("alerts.priority"),
        [alertField.alert_message]: i18n.t("alerts.body"),
    };
};
refreshArrays();
i18n.on("languageChanged", () => {
    refreshArrays();
}); 

export const alertUpdateValues = {
    [alertField.id]: "",
    [alertField.subject]: "",
    [alertField.priority]: "" as PriorityLevel,
    [alertField.alert_message]: "",
    [alertField.unread_by_users]: "",
    [alertField.created_by_user]: "",
    [alertField.date_created]: "",
};

export type TAlertUpdateValues = IAlert;

export const validationSchema = () =>
    Yup.object().shape({
        [alertField.subject]: Yup.string()
            .label(alertFieldLabels[alertField.subject])
            .trim()
            .required()
            .max(50),
        [alertField.priority]: Yup.string().label(alertFieldLabels[alertField.priority]).required(),
        [alertField.alert_message]: Yup.string()
            .label(alertFieldLabels[alertField.alert_message])
            .max(2000)
            .required(),
    });
