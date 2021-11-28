import * as Yup from "yup";
import { Priority, IAlert } from "../../util/alerts";

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
    [alertField.priority]: "" as Priority,
    [alertField.alert_message]: "",
};

export type TAlertValues = typeof alertInitialValues;

export const alertFieldLabels = {
    [alertField.subject]: "Subject",
    [alertField.priority]: "Priority",
    [alertField.alert_message]: "Body",
};

export const alertUpdateValues = {
  [alertField.id]: "",
  [alertField.subject]: "",
  [alertField.priority]: "" as Priority,
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
