import * as Yup from "yup";
/*
  These unused Variable will be needed later when connecting to backend API
*/
import { Validation } from "../../util/validations";
import { Priority, IAlert } from "../../util/alerts";

export enum alertField {
    subject = "subject",
    priority = "priority",
    alert_message = "alert_message",
}

export const alertInitialValues = {
    [alertField.subject]: "",
    [alertField.priority]: "" as Priority,
    [alertField.alert_message]: "",
};

export type TAlertValues = typeof alertInitialValues;

export const alertFieldLabels = {
    [alertField.subject]: "Subject",
    [alertField.priority]: "Priority",
    [alertField.alert_message]: "Body",
};

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
