import * as Yup from "yup";

export enum GoalStatus {
    CANCELLED = "cancelled",
    ONGOING = "ongoing",
    CONCLUDED = "concluded",
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

export enum OutcomeField {
    goalStatus = "goal_met",
    outcome = "outcome",
}

export enum ImprovementField {
    provided = "provided",
    description = "desc",
}

export const fieldLabels = {
    [FormField.village]: "Village",
    [FormField.zone]: "Zone",
    [FormField.health]: "Health",
    [FormField.education]: "Education",
    [FormField.social]: "Social",
    [FormField.outcomes]: "Outcome",
    [FormField.improvements]: "Description",

};

export const initialValues = {
    [FormField.village]: "",
    [FormField.zone]: "",
    [FormField.health]: false,
    [FormField.education]: false,
    [FormField.social]: false,
    [FormField.outcomes]: {
        [FormField.health]: [],
        [FormField.education]: [],
        [FormField.social]: [],
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

export const validationSchema = () => Yup.object().shape({});
