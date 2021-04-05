import * as Yup from "yup";

export enum FormField {
    client = "client",

    rateLevel = "rate_level",
    health = "health",
    healthRate = "health_rate",
    getService = "get_service",
    needService = "need_service",
    haveDevice = "have_device",
    deviceWoking = "device_working",
    needDevice = "need_device",
    deviceType = "device_type",
    deviceSatisf = "device_satisf",
    education = "education",
    goSchool = "goSchool",
    grade = "grade",
    reasonNotSchool = "reason_not_school",
    beenSchool = "been_school",
    wantSchool = "want_school",
}

export const fieldLabels = {
    [FormField.client]: "Client",

    [FormField.rateLevel]: "Health Level",
    [FormField.health]: "Health",
    [FormField.healthRate]: "Rate your general health",
    [FormField.getService]:
        "Do you have access to rehabilitation services (e.g physiotherapy, speech therapy, training how to use assistive device)?",
    [FormField.needService]: "Do you need access to rehabilitation services?",
    [FormField.haveDevice]:
        "Do you have an assistive device(e.g wheelchair, crutches, prosthetic limbs, hearing aid)?",
    [FormField.deviceWoking]: "Is your assistive device working well?",
    [FormField.needDevice]: "Do you need an assistive device?",
    [FormField.deviceType]: "Assistive Device",
    [FormField.deviceSatisf]: "Satisfied Rate",

    [FormField.education]: "Education",
    [FormField.goSchool]: "Do you go to school?",
    [FormField.grade]: "Grade",
    [FormField.reasonNotSchool]: "Reason",
    [FormField.beenSchool]: "Have you ever been to school before?",
    [FormField.wantSchool]: "Do you want to go to school?",
};

export const initialValues = {
    [FormField.client]: 0,

    [FormField.rateLevel]: "",
    [FormField.healthRate]: "",
    [FormField.getService]: false,
    [FormField.needService]: false,
    [FormField.haveDevice]: false,
    [FormField.deviceWoking]: false,
    [FormField.needDevice]: false,
    [FormField.deviceType]: "",

    [FormField.goSchool]: false,
    [FormField.grade]: "",
    [FormField.reasonNotSchool]: "",
    [FormField.beenSchool]: false,
    [FormField.wantSchool]: false,
};

export const initialValidationSchema = () => Yup.object().shape({});

export const rateLevelValidationSchema = () =>
    Yup.object().shape({
        [FormField.rateLevel]: Yup.string().label(fieldLabels[FormField.rateLevel]).required(),
    });
export const otherServicesValidationSchema = () =>
    Yup.object().shape({
        [FormField.rateLevel]: Yup.string().label(fieldLabels[FormField.rateLevel]).required(),
    });

export type TFormValues = typeof initialValues;
