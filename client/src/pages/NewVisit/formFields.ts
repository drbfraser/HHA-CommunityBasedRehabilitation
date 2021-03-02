

export enum FormField {
    firstName = "firstame",
    lastName = "lastName",
    birthDate = "birthDate",
    gender = "gender",
    village = "village",
    zone = "zone",
    phoneNumber = "phoneNumber",
    interviewConsent = "interviewConsent",
    caregiverPresent = "caregiverPresent",
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
    [FormField.village]: "Village",
    [FormField.gender]: "Gender",
    [FormField.zone]: "Zone",
    [FormField.phoneNumber]: "Phone Number",
    [FormField.interviewConsent]: "Consent to Interview? *",
    [FormField.caregiverPresent]: "Caregiver Present? *",
    [FormField.caregiverContact]: "Caregiver Contact",
    [FormField.disability]: "Type of Disability",
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

export const initialValues = {};

export type TFormValues = typeof initialValues;

export const validationSchema = () => {};
