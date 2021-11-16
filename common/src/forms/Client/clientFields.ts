import { Validation } from "../../util/validations";
import * as Yup from "yup";
import { Gender, IClient } from "../../util/clients";

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
    full_name = "full_name",
    birth_date = "birth_date",
    phone_number = "phone_number",
    other_disability = "other_disability",
    longitude = "longitude",
    latitude = "latitude",
    caregiver_present = "caregiver_present",
    caregiver_name = "caregiver_name",
    caregiver_phone = "caregiver_phone",
    caregiver_email = "caregiver_email",
    health_risk_level = "health_risk_level",
    health_timestamp = "health_timestamp",
    social_risk_level = "social_risk_level",
    social_timestamp = "social_timestamp",
    educat_risk_level = "educat_risk_level",
    educat_timestamp = "educat_timestamp",
    last_visit_date = "last_visit_date",
}

export enum ClientDetailsFields {
    first_name = "first_name",
    last_name = "last_name",
    birth_date = "birth_date",
    gender = "gender",
    village = "village",
    zone = "zone",
    phone_number = "phone_number",
    caregiver_present = "caregiver_present",
    caregiver_phone = "caregiver_phone",
    caregiver_email = "caregiver_email",
    caregiver_name = "caregiver_name",
    disability = "disability",
    picture = "picture",
    pictureChanged = "pictureChanged",
    other_disability = "other_disability",
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

export const updateClientfieldLabels = {
    [ClientField.first_name]: "First Name",
    [ClientField.last_name]: "Last Name",
    [ClientField.birth_date]: "Birthdate",
    [ClientField.village]: "Village",
    [ClientField.gender]: "Gender",
    [ClientField.zone]: "Zone",
    [ClientField.phone_number]: "Phone Number",
    [ClientField.caregiver_present]: "Caregiver Present?",
    [ClientField.caregiver_name]: "Caregiver Name",
    [ClientField.caregiver_phone]: "Caregiver Phone Number",
    [ClientField.caregiver_email]: "Caregiver Email",
    [ClientField.disability]: "Disabilities",
    [ClientField.other_disability]: "Other Disabilities",
};

export const clientInitialValues = {
    [ClientField.firstName]: "",
    [ClientField.lastName]: "",
    [ClientField.birthDate]: "",
    [ClientField.gender]: "" as Gender,
    [ClientField.village]: "",
    [ClientField.zone]: undefined as number | undefined,
    [ClientField.phoneNumber]: "",
    [ClientField.interviewConsent]: false,
    [ClientField.caregiverPresent]: false,
    [ClientField.caregiverPhone]: "",
    [ClientField.caregiverName]: "",
    [ClientField.caregiverEmail]: "",
    [ClientField.disability]: [] as number[],
    [ClientField.otherDisability]: "",
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

export const mobileClientDetailsValidationSchema = () =>
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

export const webClientDetailsValidationSchema = () =>
    Yup.object().shape({
        [ClientField.first_name]: Yup.string()
            .label(updateClientfieldLabels[ClientField.first_name])
            .required()
            .max(50),
        [ClientField.last_name]: Yup.string()
            .label(updateClientfieldLabels[ClientField.last_name])
            .required()
            .max(50),
        [ClientField.birth_date]: Yup.date()
            .label(updateClientfieldLabels[ClientField.birth_date])
            .max(new Date(), "Birthdate cannot be in the future")
            .required(),
        [ClientField.phone_number]: Yup.string()
            .label(updateClientfieldLabels[ClientField.phone_number])
            .max(50)
            .matches(Validation.phoneRegExp, "Phone number is not valid."),
        [ClientField.disability]: Yup.array()
            .label(updateClientfieldLabels[ClientField.disability])
            .required(),
        [ClientField.other_disability]: Yup.string()
            .label(updateClientfieldLabels[ClientField.other_disability])
            .trim()
            .test(
                "require-if-other-selected",
                "Other Disability is required",
                async (other_disability, schema) =>
                    !(await Validation.otherDisabilitySelected(schema.parent.disability)) ||
                    (other_disability !== undefined && other_disability.length > 0)
            )
            .test(
                "require-if-other-selected",
                "Other Disability must be at most 100 characters",
                async (other_disability, schema) =>
                    !(await Validation.otherDisabilitySelected(schema.parent.disability)) ||
                    (other_disability !== undefined && other_disability.length <= 100)
            ),
        [ClientField.gender]: Yup.string()
            .label(updateClientfieldLabels[ClientField.gender])
            .required(),
        [ClientField.village]: Yup.string()
            .label(updateClientfieldLabels[ClientField.village])
            .required(),
        [ClientField.zone]: Yup.string()
            .label(updateClientfieldLabels[ClientField.zone])
            .required(),
        [ClientField.caregiver_name]: Yup.string()
            .label(updateClientfieldLabels[ClientField.caregiver_name])
            .max(101),
        [ClientField.caregiver_phone]: Yup.string()
            .label(updateClientfieldLabels[ClientField.caregiver_phone])
            .max(50)
            .matches(Validation.phoneRegExp, "Phone number is not valid"),
        [ClientField.caregiver_email]: Yup.string()
            .label(updateClientfieldLabels[ClientField.caregiver_email])
            .max(50)
            .matches(Validation.emailRegExp, "Email Address is not valid"),
    });

export const newClientValidationSchema = () =>
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
            .min(1)
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
        [ClientField.interviewConsent]: Yup.boolean()
            .label(clientFieldLabels[ClientField.interviewConsent])
            .oneOf([true], "Consent to Interview is required")
            .required("Consent to Interview is required"),
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
