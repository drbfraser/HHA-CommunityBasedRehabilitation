import * as Yup from "yup";
import i18n, { TFunction } from "i18next";

export enum VisitField {
    health_visit = "health_visit",
    educat_visit = "educat_visit",
    social_visit = "social_visit",
    nutrit_visit = "nutrit_visit",
    mental_visit = "mental_visit",
    longitude = "longitude",
    latitude = "latitude",
    zone = "zone",
    village = "village",
}

export enum GoalStatus {
    cancelled = "CAN",
    ongoing = "GO",
    concluded = "CON",
}

export enum VisitFormField {
    client_id = "client",
    village = "village",
    zone = "zone",
    health = "HEALTH",
    education = "EDUCAT",
    social = "SOCIAL",
    nutrition = "NUTRIT",
    mental = "MENTAL",
    outcomes = "outcomes",
    improvements = "improvements",
}

export enum OutcomeFormField {
    id = "id",
    riskType = "risk_type",
    outcome = "outcome",
    goalStatus = "goal_met",
}

export enum ImprovementFormField {
    id = "id",
    enabled = "enabled",
    riskType = "risk_type",
    provided = "provided",
    description = "desc",
}

// On language change, recompute arrays of labels
export let visitFieldLabels: { [key: string]: string } = {};
export let provisionals: { [key: string]: string[] };
const refreshArrays = () => {
    visitFieldLabels = {
        [VisitFormField.client_id]: i18n.t("newVisit.client"),
        [VisitFormField.village]: i18n.t("newVisit.village"),
        [VisitFormField.zone]: i18n.t("newVisit.zone"),
        [VisitFormField.health]: i18n.t("newVisit.health"),
        [VisitFormField.education]: i18n.t("newVisit.education"),
        [VisitFormField.social]: i18n.t("newVisit.social"),
        [VisitFormField.nutrition]: i18n.t("newVisit.nutrition"),
        [VisitFormField.mental]: i18n.t("newVisit.mental"),
        [VisitFormField.improvements]: i18n.t("newVisit.improvements"),
        [VisitFormField.outcomes]: i18n.t("newVisit.outcomes"),
        [ImprovementFormField.description]: i18n.t("newVisit.description"),
        [OutcomeFormField.outcome]: i18n.t("newVisit.outcome"),
        [GoalStatus.cancelled]: i18n.t("newVisit.cancelled"),
        [GoalStatus.ongoing]: i18n.t("newVisit.ongoing"),
        [GoalStatus.concluded]: i18n.t("newVisit.concluded"),
    };
    provisionals = {
        [VisitFormField.health]: [
            i18n.t("newVisit.advice"),
            i18n.t("newVisit.advocacy"),
            i18n.t("newVisit.encouragement"),
            i18n.t("newVisit.orthotic"),
            i18n.t("newVisit.prosthetic"),
            i18n.t("newVisit.referralToHealthCentre"),
            i18n.t("newVisit.wheelchair"),
            i18n.t("newVisit.wheelchairRepair"),
        ],
        [VisitFormField.education]: [
            i18n.t("newVisit.advice"),
            i18n.t("newVisit.advocacy"),
            i18n.t("newVisit.encouragement"),
            i18n.t("newVisit.referralToOther"),
        ],
        [VisitFormField.social]: [
            i18n.t("newVisit.advice"),
            i18n.t("newVisit.advocacy"),
            i18n.t("newVisit.encouragement"),
            i18n.t("newVisit.referralToOther"),
        ],
        [VisitFormField.nutrition]: [
            i18n.t("newVisit.advice"),
            i18n.t("newVisit.advocacy"),
            i18n.t("newVisit.encouragement"),
            i18n.t("newVisit.referralToOther"),
        ],
        [VisitFormField.mental]: [
            i18n.t("newVisit.advice"),
            i18n.t("newVisit.advocacy"),
            i18n.t("newVisit.encouragement"),
            i18n.t("newVisit.referralToOtherMentalHealth"),
        ],
    };
};
refreshArrays();
i18n.on("languageChanged", () => {
    refreshArrays();
});

export const getVisitGoalLabel = (t: TFunction, visitType: string): string => {
    const goalLabels: { [key: string]: string } = {
        [VisitFormField.health]: t("newVisit.clientHealthGoal"),
        [VisitFormField.education]: t("newVisit.clientEducationGoal"),
        [VisitFormField.social]: t("newVisit.clientSocialGoal"),
        [VisitFormField.nutrition]: t("newVisit.clientNutritionGoal"),
        [VisitFormField.mental]: t("newVisit.clientMentalHealthGoal"),
    };

    if (visitType in goalLabels) {
        return goalLabels[visitType];
    } else {
        console.error("Unknown translation key:", visitType);
        return "";
    }
};

export const getVisitGoalStatusLabel = (t: TFunction, visitType: string): string => {
    const goalStatusLabels: { [key: string]: string } = {
        [VisitFormField.health]: t("newVisit.clientHealthGoalStatus"),
        [VisitFormField.education]: t("newVisit.clientEducationGoalStatus"),
        [VisitFormField.social]: t("newVisit.clientSocialGoalStatus"),
        [VisitFormField.nutrition]: t("newVisit.clientNutritionGoalStatus"),
        [VisitFormField.mental]: t("newVisit.clientMentalHealthGoalStatus"),
    };

    if (visitType in goalStatusLabels) {
        return goalStatusLabels[visitType];
    } else {
        console.error("Unknown translation key:", visitType);
        return "";
    }
};

export const getVisitGoalRequirementLabel = (t: TFunction, visitType: string): string => {
    const goalRequirementLabels: { [key: string]: string } = {
        [VisitFormField.health]: t("newVisit.clientHealthGoalRequirement"),
        [VisitFormField.education]: t("newVisit.clientEducationGoalRequirement"),
        [VisitFormField.social]: t("newVisit.clientSocialGoalRequirement"),
        [VisitFormField.nutrition]: t("newVisit.clientNutritionGoalRequirement"),
        [VisitFormField.mental]: t("newVisit.clientMentalHealthGoalRequirement"),
    };

    if (visitType in goalRequirementLabels) {
        return goalRequirementLabels[visitType];
    } else {
        console.error("Unknown translation key:", visitType);
        return "";
    }
};

export const visitInitialValues = {
    [VisitFormField.client_id]: "",
    [VisitFormField.village]: "",
    [VisitFormField.zone]: "",
    [VisitFormField.health]: false,
    [VisitFormField.education]: false,
    [VisitFormField.social]: false,
    [VisitFormField.nutrition]: false,
    [VisitFormField.mental]: false,
    [VisitFormField.outcomes]: {
        [VisitFormField.health]: undefined,
        [VisitFormField.education]: undefined,
        [VisitFormField.social]: undefined,
        [VisitFormField.nutrition]: undefined,
        [VisitFormField.mental]: undefined,
    },
    [VisitFormField.improvements]: {
        [VisitFormField.health]: [],
        [VisitFormField.education]: [],
        [VisitFormField.social]: [],
        [VisitFormField.nutrition]: [],
        [VisitFormField.mental]: [],
    },
};

export type TVisitFormValues = typeof visitInitialValues;

export const initialValidationSchema = () =>
    Yup.object().shape({
        [VisitFormField.village]: Yup.string()
            .label(visitFieldLabels[VisitFormField.village])
            .required(),
        [VisitFormField.zone]: Yup.string().label(visitFieldLabels[VisitFormField.zone]).required(),
        [VisitFormField.health]: Yup.boolean().label(visitFieldLabels[VisitFormField.health]),
        [VisitFormField.education]: Yup.boolean().label(visitFieldLabels[VisitFormField.education]),
        [VisitFormField.social]: Yup.boolean().label(visitFieldLabels[VisitFormField.social]),
        [VisitFormField.nutrition]: Yup.boolean().label(visitFieldLabels[VisitFormField.nutrition]),
        [VisitFormField.mental]: Yup.boolean().label(visitFieldLabels[VisitFormField.mental]),
    });

export const visitTypeValidationSchema = (visitType: VisitFormField) =>
    Yup.object().shape({
        [VisitFormField.improvements]: Yup.object().shape({
            [visitType]: Yup.array().of(
                Yup.object().shape({
                    [ImprovementFormField.description]: Yup.string().test(
                        "Required-If-Enabled",
                        i18n.t("newVisit.isRequiredField", {
                            field: visitFieldLabels[ImprovementFormField.description],
                        }),
                        (description, context) =>
                            context.parent.enabled ? description !== undefined : true
                    ),
                })
            ),
        }),
        [VisitFormField.outcomes]: Yup.object().shape({
            [visitType]: Yup.object().shape({
                [OutcomeFormField.outcome]: Yup.string()
                    .label(visitFieldLabels[OutcomeFormField.outcome])
                    .required(),
            }),
        }),
    });
