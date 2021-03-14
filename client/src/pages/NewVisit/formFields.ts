import * as Yup from "yup";

export enum GoalStatus {
    CAN = "Cancelled",
    GO = "Ongoing",
    CON = "Concluded",
}

export enum FormField {
    village = "village",
    zone = "zone",
    health = "health",
    education = "educat",
    social = "social",
    outcomes = "outcomes",
    improvements = "improvements",
}

export enum OutcomeFormField {
    riskType = "riskType",
    outcome = "outcome",
    goalStatus = "goal_met",
}

export enum ImprovementFormField {
    riskType = "riskType",
    provided = "provided",
    description = "desc",
}

export const fieldLabels = {
    [FormField.village]: "Village",
    [FormField.zone]: "Zone",
    [FormField.health]: "Health",
    [FormField.education]: "Education",
    [FormField.social]: "Social",
    [FormField.outcomes]: "Outcomes",
    [FormField.improvements]: "Description",
};

export const initialValues = {
    [FormField.village]: "",
    [FormField.zone]: "",
    [FormField.health]: false,
    [FormField.education]: false,
    [FormField.social]: false,
    [FormField.outcomes]: {
        [FormField.health]: {},
        [FormField.education]: {},
        [FormField.social]: {},
    },
    [FormField.improvements]: {
        [FormField.health]: [],
        [FormField.education]: [],
        [FormField.social]: [],
    },
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
};

export type TFormValues = typeof initialValues;

const initialValidationSchema = () =>
    Yup.object()
        .shape({
            [FormField.health]: Yup.boolean().label(fieldLabels[FormField.health]),
            [FormField.education]: Yup.boolean().label(fieldLabels[FormField.education]),
            [FormField.social]: Yup.boolean().label(fieldLabels[FormField.social]),
        })
        .test(
            "atLeastOneVisitTypeTest",
            "This is an error to display (except that its not displaying rn lol)",
            (object) => {
                if (
                    object[FormField.health] ||
                    object[FormField.education] ||
                    object[FormField.social]
                ) {
                    return true;
                } else {
                    return false;
                }
            }
        );

const visitTypeValidationSchema = (visitType: FormField) =>
    Yup.object().shape({
        [FormField.improvements]: Yup.array().of(
            Yup.object().shape({
                [visitType]: Yup.array().of(
                    Yup.object().shape({
                        [ImprovementFormField.description]: Yup.string()
                            .label("Description")
                            .required(),
                    })
                ),
            })
        ),
        [FormField.outcomes]: Yup.array().of(
            Yup.object().shape({
                [visitType]: Yup.array().of(
                    Yup.object().shape({
                        [OutcomeFormField.outcome]: Yup.string().required(),
                    })
                ),
            })
        ),
    });

export const validationSchemas = [
    initialValidationSchema,
    () => visitTypeValidationSchema(FormField.health),
    () => visitTypeValidationSchema(FormField.education),
    () => visitTypeValidationSchema(FormField.social),
];
