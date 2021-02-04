import * as Yup from "yup";

export enum FormField {
    profilePicture = "profilePicture",
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
    [FormField.profilePicture]:
        "data:image/webp;base64,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",
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
