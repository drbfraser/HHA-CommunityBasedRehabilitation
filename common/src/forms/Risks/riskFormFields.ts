import * as Yup from "yup";

export enum FormField {
    risk_level = "risk_level",
    requirement = "requirement",
    goal = "goal",
}

export const fieldLabels = {
    [FormField.risk_level]: "Risk Level",
    [FormField.requirement]: "Requirements",
    [FormField.goal]: "Goals",
};

export const validationSchema = () =>
    Yup.object().shape({
        [FormField.risk_level]: Yup.string().label(fieldLabels[FormField.risk_level]).required(),
        [FormField.requirement]: Yup.string().label(fieldLabels[FormField.requirement]).required(),
        [FormField.goal]: Yup.string().label(fieldLabels[FormField.goal]).required(),
    });
