import * as Yup from "yup";
import { Validation } from "../../util/validations";
import { Priority, IAlert } from "../../util/alerts";

export enum alertField {
    subject = "subject",
    priority = "priority",
    body = "body",
}

export const alertInitialValues = {
    [alertField.subject]: "",
    [alertField.priority]: "" as Priority,
    [alertField.body]: "",
};

export const alertFieldLabels = {
    [alertField.subject]: "Subject",
    [alertField.priority]: "Priority",
    [alertField.body]: "Body",
};

export const validationSchema = () =>
    Yup.object().shape({
        [alertField.subject]: Yup.string()
            .label(alertFieldLabels[alertField.subject])
            .trim()
            .required()
            .max(50),
        [alertField.priority]: Yup.string().label(alertFieldLabels[alertField.priority]).required(),
        [alertField.body]: Yup.string().label(alertFieldLabels[alertField.body]).max(2000),
    });
