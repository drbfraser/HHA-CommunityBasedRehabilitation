import * as Yup from "yup";
import { Validation } from "util/validations";

export enum FormField {
    firstName = "firstName",
    lastName = "lastName",
    birthDate = "birthDate",
    gender = "gender",
    village = "village",
    zone = "zone",
    phoneNumber = "phoneNumber",
    interviewConsent = "interviewConsent",
    caregiverPresent = "caregiverPresent",
    caregiverPhone = "caregiverPhone",
    caregiverName = "caregiverName",
    caregiverEmail = "caregiverEmail",
    disability = "disability",
    otherDisability = "otherDisability",
    healthRisk = "healthRisk",
    healthRequirements = "healthRequirements",
    healthGoals = "healthGoals",
    educationRisk = "educationRisk",
    educationRequirements = "educationRequirements",
    educationGoals = "educationGoals",
    socialRisk = "socialRisk",
    socialRequirements = "socialRequirements",
    socialGoals = "socialGoals",
}

export const fieldLabels = {
    [FormField.firstName]: "First Name",
    [FormField.lastName]: "Last Name",
    [FormField.birthDate]: "Birthdate",
    [FormField.village]: "Village",
    [FormField.gender]: "Gender",
    [FormField.zone]: "Zone",
    [FormField.phoneNumber]: "Phone Number",
    [FormField.interviewConsent]: "Consent to Interview? *",
    [FormField.caregiverPresent]: "Caregiver Present?",
    [FormField.caregiverPhone]: "Caregiver Phone Number",
    [FormField.caregiverName]: "Caregiver Name",
    [FormField.caregiverEmail]: "Caregiver Email",
    [FormField.disability]: "Disabilities",
    [FormField.otherDisability]: "Other Disabilities",
    [FormField.healthRisk]: "Health Risk",
    [FormField.healthRequirements]: "Health Requirement(s)",
    [FormField.healthGoals]: "Health Goal(s)",
    [FormField.educationRisk]: "Education Risk",
    [FormField.educationRequirements]: "Education Requirement(s)",
    [FormField.educationGoals]: "Education Goal(s)",
    [FormField.socialRisk]: "Social Risk",
    [FormField.socialRequirements]: "Social Requirement(s)",
    [FormField.socialGoals]: "Social Goal(s)",
};

export const initialValues = {
    [FormField.firstName]: "",
    [FormField.lastName]: "",
    [FormField.birthDate]: "",
    [FormField.gender]: "",
    [FormField.village]: "",
    [FormField.zone]: "",
    [FormField.phoneNumber]: "",
    [FormField.interviewConsent]: false,
    [FormField.caregiverPresent]: false,
    [FormField.caregiverPhone]: "",
    [FormField.caregiverName]: "",
    [FormField.caregiverEmail]: "",
    [FormField.disability]: [],
    [FormField.otherDisability]: "",
    [FormField.healthRisk]: "",
    [FormField.healthRequirements]: "",
    [FormField.healthGoals]: "",
    [FormField.educationRisk]: "",
    [FormField.educationRequirements]: "",
    [FormField.educationGoals]: "",
    [FormField.socialRisk]: "",
    [FormField.socialRequirements]: "",
    [FormField.socialGoals]: "",
};

export type TFormValues = typeof initialValues;

export const validationSchema = () =>
    Yup.object().shape({
        [FormField.firstName]: Yup.string()
            .label(fieldLabels[FormField.firstName])
            .trim()
            .required()
            .max(50),
        [FormField.lastName]: Yup.string()
            .label(fieldLabels[FormField.lastName])
            .trim()
            .required()
            .max(50),
        [FormField.birthDate]: Yup.date()
            .label(fieldLabels[FormField.birthDate])
            .max(new Date(), "Birthdate cannot be in the future")
            .required(),
        [FormField.phoneNumber]: Yup.string()
            .label(fieldLabels[FormField.phoneNumber])
            .max(50)
            .matches(Validation.phoneRegExp, "Phone number is not valid."),
        [FormField.disability]: Yup.array().label(fieldLabels[FormField.disability]).required(),
        [FormField.otherDisability]: Yup.string()
            .label(fieldLabels[FormField.otherDisability])
            .test(
                "require-if-other-selected",
                "Other Disability is required",
                async (otherDisability, schema) =>
                    !(await Validation.otherDisabilitySelected(schema.parent.disability)) ||
                    (otherDisability !== undefined && otherDisability.length > 0)
            )
            .test(
                "require-if-other-selected",
                "Other Disability must be at most 100 characters",
                async (otherDisability, schema) =>
                    !(await Validation.otherDisabilitySelected(schema.parent.disability)) ||
                    (otherDisability !== undefined && otherDisability.length <= 100)
            ),
        [FormField.gender]: Yup.string().label(fieldLabels[FormField.gender]).required(),
        [FormField.village]: Yup.string().label(fieldLabels[FormField.village]).trim().required(),
        [FormField.zone]: Yup.string().label(fieldLabels[FormField.zone]).required(),
        [FormField.healthRisk]: Yup.string().label(fieldLabels[FormField.healthRisk]).required(),
        [FormField.healthRequirements]: Yup.string()
            .label(fieldLabels[FormField.healthRequirements])
            .trim()
            .required(),
        [FormField.healthGoals]: Yup.string()
            .label(fieldLabels[FormField.healthGoals])
            .trim()
            .required(),
        [FormField.educationRisk]: Yup.string()
            .label(fieldLabels[FormField.educationRisk])
            .required(),
        [FormField.educationRequirements]: Yup.string()
            .label(fieldLabels[FormField.educationRequirements])
            .trim()
            .required(),
        [FormField.educationGoals]: Yup.string()
            .label(fieldLabels[FormField.educationGoals])
            .trim()
            .required(),
        [FormField.socialRisk]: Yup.string().label(fieldLabels[FormField.socialRisk]).required(),
        [FormField.socialRequirements]: Yup.string()
            .label(fieldLabels[FormField.socialRequirements])
            .trim()
            .required(),
        [FormField.socialGoals]: Yup.string()
            .label(fieldLabels[FormField.socialGoals])
            .trim()
            .required(),
        [FormField.interviewConsent]: Yup.boolean()
            .label(fieldLabels[FormField.interviewConsent])
            .oneOf([true], "Consent to Interview is required")
            .required("Consent to Interview is required"),
        [FormField.caregiverPhone]: Yup.string()
            .label(fieldLabels[FormField.caregiverPhone])
            .max(50)
            .matches(Validation.phoneRegExp, "Phone number is not valid"),
        [FormField.caregiverName]: Yup.string()
            .label(fieldLabels[FormField.caregiverName])
            .max(101),
        [FormField.caregiverEmail]: Yup.string()
            .label(fieldLabels[FormField.caregiverEmail])
            .max(50)
            .matches(Validation.emailRegExp, "Email Address is not valid"),
    });
