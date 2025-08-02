import * as Yup from "yup";
import i18n from "i18next";
import { OutcomeGoalMet } from "../../util/visits";

export enum FormField {
    risk_type = "risk_type",
    risk_level = "risk_level",
    requirement = "requirement",
    goal = "goal",
    goal_name = "goal_name",
    goal_status = "goal_status",
    cancellation_reason = "cancellation_reason",
    timestamp = "timestamp",
    comments = "comments",
    other = "other",
}

// On language change, recompute arrays of labels
export let fieldLabels: { [key: string]: string } = {};
const refreshArrays = () => {
    fieldLabels = {
        [FormField.risk_level]: i18n.t("risks.riskLevel"),
        [FormField.requirement]: i18n.t("risks.requirements"),
        [FormField.goal_name]: i18n.t("general.goal"),
        [FormField.goal_status]: "Goal Status",
        [FormField.cancellation_reason]: i18n.t("risks.cancelReason"),
        // TODO: Need to add "Comments"
        [FormField.comments]: "Comments",
        [FormField.other]: i18n.t("referral.other"),
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
        [FormField.goal_name]: Yup.string().label(fieldLabels[FormField.goal_name]).required(),
        [FormField.goal_status]: Yup.string().label(fieldLabels[FormField.goal_status]).required(),
        [FormField.cancellation_reason]: Yup.string()
            .label(fieldLabels[FormField.cancellation_reason])
            .when(FormField.goal_status, {
                is: (val: string) => val === OutcomeGoalMet.CANCELLED,
                then: Yup.string().required(),
                otherwise: Yup.string().notRequired(),
            }),
    });
