import { Validation } from "../../util/validations";
import * as Yup from "yup";
import { IClient } from "../../util/clients";

export enum ClientField {
    firstName = "firstName",
    lastName = "lastName",
    birthDate = "birthDate",
    gender = "gender",
    village = "village",
    zone = "zone",
    phoneNumber = "phoneNumber",
    caregiverPresent = "caregiverPresent",
    caregiverPhone = "caregiverPhone",
    caregiverName = "caregiverName",
    caregiverEmail = "caregiverEmail",
    disability = "disability",
    otherDisability = "otherDisability",
    interviewConsent = "interviewConsent",
    healthRisk = "healthRisk",
    healthRequirements = "healthRequirements",
    healthGoals = "healthGoals",
    educationRisk = "educationRisk",
    educationRequirements = "educationRequirements",
    educationGoals = "educationGoals",
    socialRisk = "socialRisk",
    socialRequirements = "socialRequirements",
    socialGoals = "socialGoals",
    picture = "picture",
    pictureChanged = "pictureChanged",

    // Required to match DB attributes to display client details in web app
    first_name = "first_name",
    last_name = "last_name",
    birth_date = "birth_date",
    phone_number = "phone_number",
    other_disability = "other_disability",
    caregiver_present = "caregiver_present",
    caregiver_name = "caregiver_name",
    caregiver_phone = "caregiver_phone",
    caregiver_email = "caregiver_email",
}

export const clientFieldLabels = {
    [ClientField.firstName]: "First Name",
    [ClientField.lastName]: "Last Name",
    [ClientField.birthDate]: "Birthdate",
    [ClientField.village]: "Village",
    [ClientField.gender]: "Gender",
    [ClientField.zone]: "Zone",
    [ClientField.phoneNumber]: "Phone Number",
    [ClientField.interviewConsent]: "Consent to Interview?",
    [ClientField.caregiverPresent]: "Caregiver Present?",
    [ClientField.caregiverPhone]: "Caregiver Phone Number",
    [ClientField.caregiverName]: "Caregiver Name",
    [ClientField.caregiverEmail]: "Caregiver Email",
    [ClientField.disability]: "Disabilities",
    [ClientField.otherDisability]: "Other Disabilities",
    [ClientField.healthRisk]: "Health Risk",
    [ClientField.healthRequirements]: "Health Requirement(s)",
    [ClientField.healthGoals]: "Health Goal(s)",
    [ClientField.educationRisk]: "Education Risk",
    [ClientField.educationRequirements]: "Education Requirement(s)",
    [ClientField.educationGoals]: "Education Goal(s)",
    [ClientField.socialRisk]: "Social Risk",
    [ClientField.socialRequirements]: "Social Requirement(s)",
    [ClientField.socialGoals]: "Social Goal(s)",
};

export const clientInitialValues = {
    [ClientField.firstName]: "",
    [ClientField.lastName]: "",
    [ClientField.birthDate]: "",
    [ClientField.gender]: "",
    [ClientField.village]: "",
    [ClientField.zone]: "" as number | string,
    [ClientField.phoneNumber]: "",
    [ClientField.caregiverPresent]: false,
    [ClientField.caregiverPhone]: "",
    [ClientField.caregiverName]: "",
    [ClientField.caregiverEmail]: "",
    [ClientField.disability]: [] as number[],
    [ClientField.otherDisability]: "",
    [ClientField.interviewConsent]: false,
    [ClientField.healthRisk]: "",
    [ClientField.healthRequirements]: "",
    [ClientField.healthGoals]: "",
    [ClientField.educationRisk]: "",
    [ClientField.educationRequirements]: "",
    [ClientField.educationGoals]: "",
    [ClientField.socialRisk]: "",
    [ClientField.socialRequirements]: "",
    [ClientField.socialGoals]: "",
    [ClientField.picture]: "",
    [ClientField.pictureChanged]: false,
};

export type TClientValues = typeof clientInitialValues;

export type TClientFormValues = IClient & { [ClientField.pictureChanged]: boolean };

export const clientDetailsValidationSchema = () =>
    Yup.object().shape({
        [ClientField.firstName]: Yup.string()
            .label(clientFieldLabels[ClientField.firstName])
            .trim()
            .required()
            .max(50),
        [ClientField.lastName]: Yup.string()
            .label(clientFieldLabels[ClientField.lastName])
            .trim()
            .required()
            .max(50),
        [ClientField.birthDate]: Yup.date()
            .label(clientFieldLabels[ClientField.birthDate])
            .max(new Date(), "Birthdate cannot be in the future")
            .required(),
        [ClientField.phoneNumber]: Yup.string()
            .label(clientFieldLabels[ClientField.phoneNumber])
            .max(50)
            .matches(Validation.phoneRegExp, "Phone number is not valid."),
        [ClientField.disability]: Yup.array()
            .label(clientFieldLabels[ClientField.disability])
            .min(1, "Disability is required")
            .required(),
        [ClientField.otherDisability]: Yup.string()
            .label(clientFieldLabels[ClientField.otherDisability])
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
        [ClientField.gender]: Yup.string().label(clientFieldLabels[ClientField.gender]).required(),
        [ClientField.village]: Yup.string()
            .label(clientFieldLabels[ClientField.village])
            .trim()
            .required(),
        [ClientField.zone]: Yup.string().label(clientFieldLabels[ClientField.zone]).required(),
        [ClientField.caregiverPhone]: Yup.string()
            .label(clientFieldLabels[ClientField.caregiverPhone])
            .max(50)
            .matches(Validation.phoneRegExp, "Phone number is not valid"),
        [ClientField.caregiverName]: Yup.string()
            .label(clientFieldLabels[ClientField.caregiverName])
            .max(101),
        [ClientField.caregiverEmail]: Yup.string()
            .label(clientFieldLabels[ClientField.caregiverEmail])
            .max(50)
            .matches(Validation.emailRegExp, "Email Address is not valid"),
    });

export const newClientValidationSchema = () =>
    clientDetailsValidationSchema().concat(
        Yup.object().shape({
            [ClientField.interviewConsent]: Yup.boolean()
                .label(clientFieldLabels[ClientField.interviewConsent])
                .oneOf([true], "Consent to Interview is required")
                .required("Consent to Interview is required"),
            [ClientField.healthRisk]: Yup.string()
                .label(clientFieldLabels[ClientField.healthRisk])
                .required(),
            [ClientField.healthRequirements]: Yup.string()
                .label(clientFieldLabels[ClientField.healthRequirements])
                .trim()
                .required(),
            [ClientField.healthGoals]: Yup.string()
                .label(clientFieldLabels[ClientField.healthGoals])
                .trim()
                .required(),
            [ClientField.educationRisk]: Yup.string()
                .label(clientFieldLabels[ClientField.educationRisk])
                .required(),
            [ClientField.educationRequirements]: Yup.string()
                .label(clientFieldLabels[ClientField.educationRequirements])
                .trim()
                .required(),
            [ClientField.educationGoals]: Yup.string()
                .label(clientFieldLabels[ClientField.educationGoals])
                .trim()
                .required(),
            [ClientField.socialRisk]: Yup.string()
                .label(clientFieldLabels[ClientField.socialRisk])
                .required(),
            [ClientField.socialRequirements]: Yup.string()
                .label(clientFieldLabels[ClientField.socialRequirements])
                .trim()
                .required(),
            [ClientField.socialGoals]: Yup.string()
                .label(clientFieldLabels[ClientField.socialGoals])
                .trim()
                .required(),
        })
    );
