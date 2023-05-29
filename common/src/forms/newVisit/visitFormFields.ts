import * as Yup from "yup";

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

export const visitFieldLabels = {
    [VisitFormField.client_id]: "Client",
    [VisitFormField.village]: "Village",
    [VisitFormField.zone]: "Zone",
    [VisitFormField.health]: "Health",
    [VisitFormField.education]: "Education",
    [VisitFormField.social]: "Social",
    [VisitFormField.nutrition]: "Nutrition",
    [VisitFormField.mental]: "Mental",
    [VisitFormField.improvements]: "Improvements",
    [VisitFormField.outcomes]: "Outcomes",
    [ImprovementFormField.description]: "Description",
    [OutcomeFormField.outcome]: "Outcome",
    [GoalStatus.cancelled]: "Cancelled",
    [GoalStatus.ongoing]: "Ongoing",
    [GoalStatus.concluded]: "Concluded",
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

export const provisionals: { [key: string]: string[] } = {
    [VisitFormField.health]: [
        "Advice",
        "Advocacy",
        "Encouragement",
        "Orthotic",
        "Prosthetic",
        "Referral to Health Centre",
        "Wheelchair",
        "Wheelchair Repair",
    ],
    [VisitFormField.education]: [
        "Advice",
        "Advocacy",
        "Encouragement",
        "Referral to Other Organization",
    ],
    [VisitFormField.social]: [
        "Advice",
        "Advocacy",
        "Encouragement",
        "Referral to Other Organization",
    ],
    [VisitFormField.nutrition]: [
        "Advice",
        "Advocacy",
        "Encouragement",
        "Referral to Other Organization",
    ],
    [VisitFormField.mental]: [
        "Advice",
        "Advocacy",
        "Encouragement",
        "Referral to Other Mental Health Organization",
    ],
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
                        `${visitFieldLabels[ImprovementFormField.description]} is a required field`,
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
