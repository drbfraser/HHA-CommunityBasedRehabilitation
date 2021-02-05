import * as Yup from "yup";

export enum FormField {
    firstName = "firstName",
    lastName = "lastName",
    birthDate = "birthDate",
    gender = "gender",
    villageNo = "villageNo",
    zone = "zone",
    contact = "contact",
    interviewConsent = "interviewConsent",
    hasCaregiver = "hasCaregiver",
    caregiverContact = "caregiverContact",
    disability = "disability",
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
    [FormField.villageNo]: "Village Number",
    [FormField.gender]: "Gender",
    [FormField.zone]: "Zone",
    [FormField.contact]: "Contact",
    [FormField.interviewConsent]: "Consent to Interview? *",
    [FormField.hasCaregiver]: "Caregiver Present? *",
    [FormField.caregiverContact]: "Caregiver Contact",
    [FormField.disability]: "Type of Disability",
    [FormField.healthRisk]: "Health Risk",
    [FormField.healthRequirements]: "Health Requirement(s)",
    [FormField.healthGoals]: "Health Goal(s)",
    [FormField.educationRisk]: "Education Status",
    [FormField.educationRequirements]: "Education Requirement(s)",
    [FormField.educationGoals]: "Education Goal(s)",
    [FormField.socialRisk]: "Social Status",
    [FormField.socialRequirements]: "Social Requirement(s)",
    [FormField.socialGoals]: "Social Goal(s)",
};

export const initialValues = {
    [FormField.firstName]: "",
    [FormField.lastName]: "",
    [FormField.birthDate]: null,
    [FormField.gender]: "",
    [FormField.villageNo]: null,
    [FormField.zone]: "",
    [FormField.contact]: "",
    [FormField.interviewConsent]: false,
    [FormField.hasCaregiver]: false,
    [FormField.caregiverContact]: "",
    [FormField.disability]: "",
    [FormField.healthRisk]: "",
    [FormField.healthRequirements]: "",
    [FormField.healthRisk]: "",
    [FormField.educationRisk]: "",
    [FormField.educationGoals]: "",
    [FormField.socialRisk]: "",
    [FormField.socialRequirements]: "",
    [FormField.socialGoals]: "",
};

export type TFormValues = typeof initialValues;

export const genderOptions = [
    {
        name: "Female",
        value: "female",
    },
    {
        name: "Male",
        value: "male",
    },
];

export const zoneOptions = [
    {
        name: "BidiBidi #1",
        value: "bidibidi1",
    },
    {
        name: "BIdiBidi #2",
        value: "bidibidi2",
    },
    {
        name: "BidiBidi #3",
        value: "bidibidi3",
    },
];

export const riskOptions = [
    {
        name: "Critical",
        value: "critical",
    },
    {
        name: "High",
        value: "high",
    },
    {
        name: "Medium",
        value: "medium",
    },
    {
        name: "Low",
        value: "low",
    },
];

const phoneRegex = RegExp(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/);

export const validationSchema = () =>
    Yup.object().shape({
        [FormField.firstName]: Yup.string()
            .label("First name")
            .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ")
            .required(),
        [FormField.lastName]: Yup.string()
            .label("Last name")
            .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ")
            .required(),
        [FormField.birthDate]: Yup.date()
            .label("Birthdate")
            .max(new Date(), "Birthdate cannot be in the future")
            .required(),
        [FormField.contact]: Yup.string()
            .label("Phone Number")
            .matches(phoneRegex, "Phone number is not valid."),
        [FormField.gender]: Yup.string().label("Gender").required(),
        [FormField.villageNo]: Yup.number()
            .label("Village number")
            .typeError("Village number must be a number.")
            .positive("Vilalge number must be greater than zero.")
            .required(),
        [FormField.zone]: Yup.string().label("Zone").required(),
        [FormField.healthRisk]: Yup.string().label("Health risk").required(),
        [FormField.healthRequirements]: Yup.string().label("Health requirements").required(),
        [FormField.healthGoals]: Yup.string().label("Health goals").required(),
        [FormField.educationRisk]: Yup.string().label("Education status").required(),
        [FormField.educationRequirements]: Yup.string().label("Education requirements").required(),
        [FormField.educationGoals]: Yup.string().label("Education goals").required(),
        [FormField.socialRisk]: Yup.string().label("Social status").required(),
        [FormField.socialRequirements]: Yup.string().label("Social requirements").required(),
        [FormField.socialGoals]: Yup.string().label("Social goals").required(),
    });
