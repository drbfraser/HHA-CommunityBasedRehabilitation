import { Validation } from "../../util/validations";
import * as Yup from "yup";
import { Gender, IClient } from "../../util/clients";
import i18n from "i18next";

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
    nutritionRisk = "nutritionRisk",
    nutritionRequirements = "nutritionRequirements",
    nutritionGoals = "nutritionGoals",
    mentalRisk = "mentalRisk",
    mentalRequirements = "mentalRequirements",
    mentalGoals = "mentalGoals",
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
    nutrit_risk_level = "nutrit_risk_level",
    nutrit_timestamp = "nutrit_timestamp",
    mental_risk_level = "mental_risk_level",
    mental_timestamp = "mental_timestamp",
    last_visit_date = "last_visit_date",
    is_active = "is_active",
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
    is_active = "is_active",
    hcr_type = "hcr_type",
}

// TODO: START REMOVE
export const isThisExportingString = "Is this exporting? (3)";

// Write a function that returns the current language
export const getCurrentLanguage = () => {
    return i18n.language;
};
export const getCurrentLanguageObject = () => {
    return i18n;
};
export const getTranslationForFirstName = () => {
    return i18n.t("clientFields.firstName");
};
// TODO: END REMOVE

console.log("--> ClientFields.ts: Current language is: ", i18n.language);
console.log("--> ClientFields.ts: Current first name is: ", i18n.t("clientFields.firstName"));

// On language change, recompute arrays of labels
export let clientFieldLabels: { [key: string]: string } = {};
export let updateClientfieldLabels: { [key: string]: string } = {};

const refreshArrays = () => {
    clientFieldLabels = {
        [ClientField.firstName]: i18n.t("clientFields.firstName"),
        [ClientField.lastName]: i18n.t("clientFields.lastName"),
        [ClientField.birthDate]: i18n.t("clientFields.birthDate"),
        [ClientField.village]: i18n.t("clientFields.village"),
        [ClientField.gender]: i18n.t("clientFields.gender"),
        [ClientField.zone]: i18n.t("clientFields.zone"),
        [ClientField.phoneNumber]: i18n.t("clientFields.phoneNumber"),
        [ClientField.interviewConsent]: i18n.t("clientFields.interviewConsent"),
        [ClientField.caregiverPresent]: i18n.t("clientFields.caregiverPresent"),
        [ClientField.caregiverPhone]: i18n.t("clientFields.caregiverPhone"),
        [ClientField.caregiverName]: i18n.t("clientFields.caregiverName"),
        [ClientField.caregiverEmail]: i18n.t("clientFields.caregiverEmail"),
        [ClientField.disability]: i18n.t("clientFields.disability"),
        [ClientField.otherDisability]: i18n.t("clientFields.otherDisability"),
        [ClientField.healthRisk]: i18n.t("clientFields.healthRisk"),
        [ClientField.healthRequirements]: i18n.t("clientFields.healthRequirements"),
        [ClientField.healthGoals]: i18n.t("clientFields.healthGoals"),
        [ClientField.educationRisk]: i18n.t("clientFields.educationRisk"),
        [ClientField.educationRequirements]: i18n.t("clientFields.educationRequirements"),
        [ClientField.educationGoals]: i18n.t("clientFields.educationGoals"),
        [ClientField.socialRisk]: i18n.t("clientFields.socialRisk"),
        [ClientField.socialRequirements]: i18n.t("clientFields.socialRequirements"),
        [ClientField.socialGoals]: i18n.t("clientFields.socialGoals"),
        [ClientField.nutritionRisk]: i18n.t("clientFields.nutritionRisk"),
        [ClientField.nutritionRequirements]: i18n.t("clientFields.nutritionRequirements"),
        [ClientField.nutritionGoals]: i18n.t("clientFields.nutritionGoals"),
        [ClientField.mentalRisk]: i18n.t("clientFields.mentalRisk"),
        [ClientField.mentalRequirements]: i18n.t("clientFields.mentalRequirements"),
        [ClientField.mentalGoals]: i18n.t("clientFields.mentalGoals"),
    };

    updateClientfieldLabels = {
        // TODO: Why are these names in snake_case vs camelCase as used above?
        [ClientField.first_name]: i18n.t("clientFields.firstName"),
        [ClientField.last_name]: i18n.t("clientFields.lastName"),
        [ClientField.birth_date]: i18n.t("clientFields.birthDate"),
        [ClientField.village]: i18n.t("clientFields.village"),
        [ClientField.gender]: i18n.t("clientFields.gender"),
        [ClientField.zone]: i18n.t("clientFields.zone"),
        [ClientField.phone_number]: i18n.t("clientFields.phoneNumber"),
        [ClientField.caregiver_present]: i18n.t("clientFields.caregiverPresent"),
        [ClientField.caregiver_name]: i18n.t("clientFields.caregiverName"),
        [ClientField.caregiver_phone]: i18n.t("clientFields.caregiverPhone"),
        [ClientField.caregiver_email]: i18n.t("clientFields.caregiverEmail"),
        [ClientField.disability]: i18n.t("clientFields.disability"),
        [ClientField.other_disability]: i18n.t("clientFields.otherDisability"),
    };
};
refreshArrays();
i18n.on("languageChanged", () => {
    console.log("!!! ==> common:clientFields - i18n languageChanged event fired:", i18n.language);
    refreshArrays();
});

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
    [ClientField.nutritionRisk]: "",
    [ClientField.nutritionRequirements]: "",
    [ClientField.nutritionGoals]: "",
    [ClientField.mentalRisk]: "",
    [ClientField.mentalRequirements]: "",
    [ClientField.mentalGoals]: "",
    [ClientField.picture]: "",
    [ClientField.pictureChanged]: false,
    [ClientField.is_active]: true,
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
            .max(new Date(), i18n.t("clientFields.birthdayNotFuture"))
            .required(),
        [ClientField.phoneNumber]: Yup.string()
            .label(clientFieldLabels[ClientField.phoneNumber])
            .max(50)
            .matches(Validation.phoneRegExp, i18n.t("clientFields.phoneNumberNotValid")),
        [ClientField.disability]: Yup.array()
            .label(clientFieldLabels[ClientField.disability])
            .min(1, i18n.t("clientFields.disabilityRequired"))
            .required(),
        [ClientField.otherDisability]: Yup.string()
            .label(clientFieldLabels[ClientField.otherDisability])
            .test(
                "require-if-other-selected",
                i18n.t("clientFields.otherDisabilityRequired"),
                async (otherDisability, schema) =>
                    !(await Validation.otherDisabilitySelected(schema.parent.disability)) ||
                    (otherDisability !== undefined && otherDisability.length > 0)
            )
            .test(
                "require-if-other-selected",
                i18n.t("clientFields.otherDisabilityTooLong"),
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
            .matches(Validation.phoneRegExp, i18n.t("clientFields.phoneNumberNotValid")),
        [ClientField.caregiverName]: Yup.string()
            .label(clientFieldLabels[ClientField.caregiverName])
            .max(101),
        [ClientField.caregiverEmail]: Yup.string()
            .label(clientFieldLabels[ClientField.caregiverEmail])
            .max(50)
            .matches(Validation.emailRegExp, i18n.t("clientFields.emailAddressNotValid")),
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
            .max(new Date(), i18n.t("clientFields.birthdayNotFuture"))
            .required(),
        [ClientField.phone_number]: Yup.string()
            .label(updateClientfieldLabels[ClientField.phone_number])
            .max(50)
            .matches(Validation.phoneRegExp, i18n.t("clientFields.phoneNumberNotValid")),
        [ClientField.disability]: Yup.array()
            .label(updateClientfieldLabels[ClientField.disability])
            .required(),
        [ClientField.other_disability]: Yup.string()
            .label(updateClientfieldLabels[ClientField.other_disability])
            .trim()
            .test(
                "require-if-other-selected",
                i18n.t("clientFields.otherDisabilityRequired"),
                async (other_disability, schema) =>
                    !(await Validation.otherDisabilitySelected(schema.parent.disability)) ||
                    (other_disability !== undefined && other_disability.length > 0)
            )
            .test(
                "require-if-other-selected",
                i18n.t("clientFields.otherDisabilityTooLong"),
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
            .matches(Validation.phoneRegExp, i18n.t("clientFields.phoneNumberNotValid")),
        [ClientField.caregiver_email]: Yup.string()
            .label(updateClientfieldLabels[ClientField.caregiver_email])
            .max(50)
            .matches(Validation.emailRegExp, i18n.t("clientFields.emailAddressNotValid")),
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
            .max(new Date(), i18n.t("clientFields.birthdayNotFuture"))
            .required(),
        [ClientField.phoneNumber]: Yup.string()
            .label(clientFieldLabels[ClientField.phoneNumber])
            .max(50)
            .matches(Validation.phoneRegExp, i18n.t("clientFields.phoneNumberNotValid")),
        [ClientField.disability]: Yup.array()
            .label(clientFieldLabels[ClientField.disability])
            .min(1)
            .required(),
        [ClientField.otherDisability]: Yup.string()
            .label(clientFieldLabels[ClientField.otherDisability])
            .test(
                "require-if-other-selected",
                i18n.t("clientFields.otherDisabilityRequired"),
                async (otherDisability, schema) =>
                    !(await Validation.otherDisabilitySelected(schema.parent.disability)) ||
                    (otherDisability !== undefined && otherDisability.length > 0)
            )
            .test(
                "require-if-other-selected",
                i18n.t("clientFields.otherDisabilityTooLong"),
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
        [ClientField.nutritionRisk]: Yup.string()
            .label(clientFieldLabels[ClientField.nutritionRisk])
            .required(),
        [ClientField.nutritionRequirements]: Yup.string()
            .label(clientFieldLabels[ClientField.nutritionRequirements])
            .trim()
            .required(),
        [ClientField.nutritionGoals]: Yup.string()
            .label(clientFieldLabels[ClientField.nutritionGoals])
            .trim()
            .required(),
        [ClientField.mentalRisk]: Yup.string()
            .label(clientFieldLabels[ClientField.mentalRisk])
            .required(),
        [ClientField.mentalRequirements]: Yup.string()
            .label(clientFieldLabels[ClientField.mentalRequirements])
            .trim()
            .required(),
        [ClientField.mentalGoals]: Yup.string()
            .label(clientFieldLabels[ClientField.mentalGoals])
            .trim()
            .required(),
        [ClientField.interviewConsent]: Yup.boolean()
            .label(clientFieldLabels[ClientField.interviewConsent])
            .oneOf([true], i18n.t("clientFields.consentToInterviewRequired"))
            .required(i18n.t("clientFields.consentToInterviewRequired")),
        [ClientField.caregiverPhone]: Yup.string()
            .label(clientFieldLabels[ClientField.caregiverPhone])
            .max(50)
            .matches(Validation.phoneRegExp, i18n.t("clientFields.phoneNumberNotValid")),
        [ClientField.caregiverName]: Yup.string()
            .label(clientFieldLabels[ClientField.caregiverName])
            .max(101),
        [ClientField.caregiverEmail]: Yup.string()
            .label(clientFieldLabels[ClientField.caregiverEmail])
            .max(50)
            .matches(Validation.emailRegExp, i18n.t("clientFields.emailAddressNotValid")),
    });
