import * as Yup from "yup";
import { Validation } from "../../util/validations";
import { Priority, IAlert } from "../../util/alerts";

export enum FormField {
    subject = "subject",
    priority = "priority",
    body = "body",
}

export const fieldLabels = {
    [FormField.subject]: "Subject",
    [FormField.priority]: "Priority",
    [FormField.body]: "Body",
};

export const initialValues = {
    [FormField.subject]: "",
    [FormField.priority]: "" as Priority,
    [FormField.body]: "",
};

export const clientFieldLabels = {
  [FormField.subject]: "Last Name",
  [FormField.priority]: "Birthdate",
  [FormField.body]: "Village",
};

export const validationSchema = () =>
    Yup.object().shape({
        [FormField.subject]: Yup.string()
            .label(fieldLabels[FormField.subject])
            .trim()
            .required()
            .max(50),
        [FormField.priority]: Yup.string()
            .label(clientFieldLabels[FormField.priority])
            .required(),
        [FormField.body]: Yup.string()
            .label(fieldLabels[FormField.body])
            .max(1000),
    });