import * as Yup from "yup";

export enum GoalStatus {
    cancelled = "CAN",
    ongoing = "GO",
    concluded = "CON",
}

export enum FormField {
    client = "client",
    village = "village",
    zone = "zone",
    health = "HEALTH",
    education = "EDUCAT",
    social = "SOCIAL",
    nutrition = "NUTRIT",
    mental = "MENTAL",
    outcomes = "outcomes",
    improvements = "improvements",
    picture = "picture",
}

export enum OutcomeFormField {
    riskType = "risk_type",
    outcome = "outcome",
    goalStatus = "goal_met",
}

export enum ImprovementFormField {
    enabled = "enabled",
    riskType = "risk_type",
    provided = "provided",
    description = "desc",
}

export const fieldLabels = {
    [FormField.client]: "Client",
    [FormField.village]: "Village",
    [FormField.zone]: "Zone",
    [FormField.health]: "Health",
    [FormField.education]: "Education",
    [FormField.social]: "Social",
    [FormField.nutrition]: "Nutrition",
    [FormField.mental]: "Mental",
    [FormField.improvements]: "Improvements",
    [FormField.outcomes]: "Outcomes",
    [ImprovementFormField.description]: "Description",
    [OutcomeFormField.outcome]: "Outcome",
    [GoalStatus.cancelled]: "Cancelled",
    [GoalStatus.ongoing]: "Ongoing",
    [GoalStatus.concluded]: "Concluded",
};

export const initialValues = {
    [FormField.client]: "",
    [FormField.village]: "",
    [FormField.zone]: "",
    [FormField.health]: false,
    [FormField.education]: false,
    [FormField.social]: false,
    [FormField.nutrition]: false,
    [FormField.mental]: false,
    [FormField.outcomes]: {
        [FormField.health]: undefined,
        [FormField.education]: undefined,
        [FormField.social]: undefined,
        [FormField.nutrition]: undefined,
        [FormField.mental]: undefined,
    },
    [FormField.improvements]: {
        [FormField.health]: [],
        [FormField.education]: [],
        [FormField.social]: [],
        [FormField.nutrition]: [],
        [FormField.mental]: [],
    },
    [FormField.picture]: "",
};

export const provisionals: { [key: string]: string[] } = {
    [FormField.health]: [
        "Advice",
        "Advocacy",
        "Encouragement",
        "Orthotic",
        "Prosthetic",
        "Referral to Health Centre",
        "Wheelchair",
        "Wheelchair Repair",
    ],
    [FormField.education]: [
        "Advice",
        "Advocacy",
        "Encouragement",
        "Referral to Other Organization",
    ],
    [FormField.social]: ["Advice", "Advocacy", "Encouragement", "Referral to Other Organization"],
    [FormField.nutrition]: [
        "Advice",
        "Advocacy",
        "Encouragement",
        "Referral to Other Organization",
    ],
    [FormField.mental]: [
        "Advice",
        "Advocacy",
        "Encouragement",
        "Referral to Mental Health Organization",
    ],
};

export type TFormValues = typeof initialValues;

export const initialValidationSchema = () =>
    Yup.object().shape({
        [FormField.village]: Yup.string().label(fieldLabels[FormField.village]).required(),
        [FormField.zone]: Yup.string().label(fieldLabels[FormField.zone]).required(),
        [FormField.health]: Yup.boolean().label(fieldLabels[FormField.health]),
        [FormField.education]: Yup.boolean().label(fieldLabels[FormField.education]),
        [FormField.social]: Yup.boolean().label(fieldLabels[FormField.social]),
        [FormField.nutrition]: Yup.boolean().label(fieldLabels[FormField.nutrition]),
        [FormField.mental]: Yup.boolean().label(fieldLabels[FormField.mental]),
    });

export const visitTypeValidationSchema = (visitType: FormField) =>
    Yup.object().shape({
        [FormField.improvements]: Yup.object().shape({
            [visitType]: Yup.array().of(
                Yup.object().shape({
                    [ImprovementFormField.description]: Yup.string().test(
                        "Required-If-Enabled",
                        `${fieldLabels[ImprovementFormField.description]} is a required field`,
                        (description, context) =>
                            context.parent.enabled ? description !== undefined : true
                    ),
                })
            ),
        }),
        [FormField.outcomes]: Yup.object().shape({
            [visitType]: Yup.object().shape({
                [OutcomeFormField.outcome]: Yup.string()
                    .label(fieldLabels[OutcomeFormField.outcome])
                    .required(),
            }),
        }),
    });
