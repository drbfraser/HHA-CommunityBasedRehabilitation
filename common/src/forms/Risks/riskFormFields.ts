import * as Yup from "yup";
import i18n from "i18next";

export enum FormField {
    risk_type = "risk_type",
    risk_level = "risk_level",
    requirement = "requirement",
    goal = "goal",
    timestamp = "timestamp",
}

// On language change, recompute arrays of labels
export var fieldLabels: { [key: string]: string } = {};
const refreshArrays = () => {
    fieldLabels = {
        [FormField.risk_level]: i18n.t("risks.riskLevel"),
        [FormField.requirement]: i18n.t("risks.requirements"),
        [FormField.goal]: i18n.t("risks.goals"),
    };
};
refreshArrays();
i18n.on("languageChanged", () => {
    refreshArrays();
});

export const validationSchema = () =>
    Yup.object().shape({
        [FormField.risk_level]: Yup.string().label(fieldLabels[FormField.risk_level]).required(),
        [FormField.requirement]: Yup.string().label(fieldLabels[FormField.requirement]).required(),
        [FormField.goal]: Yup.string().label(fieldLabels[FormField.goal]).required(),
    });
