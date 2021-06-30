import { FormikProps } from "formik";
import * as Yup from "yup";
export interface IFormProps {
    formikProps: FormikProps<any>;
}

export enum FormField {
    client = "client",
    surveyConsent = "give_consent",

    health = "health",
    rateLevel = "rate_level",
    getService = "get_service",
    needService = "need_service",
    haveDevice = "have_device",
    deviceWorking = "device_working",
    needDevice = "need_device",
    deviceType = "device_type",
    serviceSatisf = "service_satisf",

    education = "education",
    goSchool = "go_school",
    grade = "grade",
    reasonNotSchool = "reason_not_school",
    beenSchool = "been_school",
    wantSchool = "want_school",

    social = "social",
    feelValue = "feel_value",
    feelIndependent = "feel_independent",
    ableInSocial = "able_in_social",
    disabiAffectSocial = "disability_affect_social",
    disabiDiscrimination = "disability_discrimination",

    livelihood = "livelihood",
    isWorking = "is_working",
    job = "job",
    isSelfEmployed = "is_employed",
    meetFinanceNeeds = "meet_finance_needs",
    disabiAffectWork = "disability_affect_work",
    wantWork = "want_work",

    foodAndNutrition = "food_nutrition",
    foodSecurityRate = "food_security",
    enoughFoodPerMonth = "enough_food_per_month",
    isChild = "is_child",
    childNourish = "child_nourish",

    empowerment = "empowerment",
    memOfOrgan = "mem_of_organ",
    organization = "organization",
    awareRight = "aware_right",
    ableInfluence = "able_influence",

    shelterAndCare = "shelter_care",
    haveShelter = "have_shelter",
    accessItem = "access_item",
}
export const servicesTypes = [FormField.health, FormField.education, FormField.social];

export const fieldLabels = {
    [FormField.client]: "Client",
    [FormField.surveyConsent]: "I give the consent to take the baseline survey",
    [FormField.rateLevel]: "Health Level",
    [FormField.health]: "Health",
    [FormField.getService]:
        "I have access to rehabilitation services (e.g physiotherapy, speech therapy, training how to use assistive device)",
    [FormField.needService]: "I need access to rehabilitation services",
    [FormField.haveDevice]:
        "I have an assistive device (e.g wheelchair, crutches, prosthetic limbs, hearing aid)",
    [FormField.deviceWorking]: "My assistive device is working well",
    [FormField.needDevice]: "I need an assistive device",
    [FormField.deviceType]: "Assistive Device",
    [FormField.serviceSatisf]: "Satisfied Rate",

    [FormField.education]: "Education",
    [FormField.goSchool]: "I go to school",
    [FormField.grade]: "Grade",
    [FormField.reasonNotSchool]: "Reason",
    [FormField.beenSchool]: "I have been to school before",
    [FormField.wantSchool]: "I want to go to school",

    [FormField.social]: "Social",
    [FormField.feelValue]: "I feel valued as a member of my community",
    [FormField.feelIndependent]: "I feel independent",
    [FormField.ableInSocial]:
        "I am able to participate in community/social events (going to church, market, meeting friends)",
    [FormField.disabiAffectSocial]: "My disability affects my ability to interact socially",
    [FormField.disabiDiscrimination]: "I have experienced discrimination because of my disability",

    [FormField.livelihood]: "Livelihood",
    [FormField.isWorking]: "I am working",
    [FormField.job]: "Job",
    [FormField.meetFinanceNeeds]: "This meets my financial needs",
    [FormField.disabiAffectWork]: "My disability affects my ability to go to work",
    [FormField.wantWork]: "I want to work",
    [FormField.isSelfEmployed]: "I am",

    [FormField.foodAndNutrition]: "Food and Nutrition",
    [FormField.foodSecurityRate]: "Rate",
    [FormField.enoughFoodPerMonth]: "I have enough food every month",
    [FormField.isChild]: "I am a child or have a child",
    [FormField.childNourish]: "Nourishment",

    [FormField.empowerment]: "Empowerment",
    [FormField.memOfOrgan]:
        "I am a member of some organisations which assist people with disabilities",
    [FormField.organization]: "Organization",
    [FormField.awareRight]: "I am aware of my rights as a citizen living with disabilities",
    [FormField.ableInfluence]: "I feel like I am able to influence people around me",

    [FormField.shelterAndCare]: "Shelter and Care",
    [FormField.haveShelter]: "I have adequate shelter",
    [FormField.accessItem]: "I have access to essential items for my household",
};

export const initialValues = {
    [FormField.client]: 0,
    [FormField.surveyConsent]: false,

    [FormField.rateLevel]: "",
    [FormField.getService]: false,
    [FormField.needService]: false,
    [FormField.haveDevice]: false,
    [FormField.deviceWorking]: false,
    [FormField.needDevice]: false,
    [FormField.deviceType]: "",
    [FormField.serviceSatisf]: "",

    [FormField.goSchool]: false,
    [FormField.grade]: 0,
    [FormField.reasonNotSchool]: "",
    [FormField.beenSchool]: false,
    [FormField.wantSchool]: false,

    [FormField.feelValue]: false,
    [FormField.feelIndependent]: false,
    [FormField.ableInSocial]: false,
    [FormField.disabiAffectSocial]: false,
    [FormField.disabiDiscrimination]: false,

    [FormField.isWorking]: false,
    [FormField.job]: "",
    [FormField.isSelfEmployed]: "",
    [FormField.meetFinanceNeeds]: false,
    [FormField.disabiAffectWork]: false,
    [FormField.wantWork]: false,

    [FormField.foodSecurityRate]: "",
    [FormField.enoughFoodPerMonth]: false,
    [FormField.isChild]: false,
    [FormField.childNourish]: "",

    [FormField.memOfOrgan]: false,
    [FormField.organization]: "",
    [FormField.awareRight]: false,
    [FormField.ableInfluence]: false,

    [FormField.haveShelter]: false,
    [FormField.accessItem]: false,
};

export const emptyValidationSchema = () => Yup.object().shape({});
export const healthValidationSchema = () =>
    Yup.object().shape({
        [FormField.needDevice]: Yup.boolean(),
        [FormField.serviceSatisf]: Yup.string()
            .label(fieldLabels[FormField.serviceSatisf])
            .required(),
        [FormField.rateLevel]: Yup.string().label(fieldLabels[FormField.rateLevel]).required(),
        [FormField.deviceType]: Yup.string()
            .label(fieldLabels[FormField.deviceType])
            .when(FormField.needDevice, {
                is: true,
                then: Yup.string().label(fieldLabels[FormField.deviceType]).required(),
            }),
    });

export const educationValidationSchema = () =>
    Yup.object().shape({
        [FormField.goSchool]: Yup.boolean(),
        [FormField.grade]: Yup.string()
            .label(fieldLabels[FormField.reasonNotSchool])
            .when(FormField.goSchool, {
                is: false,
                then: Yup.string().label(fieldLabels[FormField.reasonNotSchool]).required(),
            }),
        [FormField.grade]: Yup.string()
            .label(fieldLabels[FormField.grade])
            .when(FormField.goSchool, {
                is: true,
                then: Yup.string().label(fieldLabels[FormField.grade]).required(),
            }),
    });

export const livelihoodValidationSchema = () =>
    Yup.object().shape({
        [FormField.isWorking]: Yup.boolean(),
        [FormField.job]: Yup.string()
            .label(fieldLabels[FormField.job])
            .when(FormField.isWorking, {
                is: true,
                then: Yup.string().label(fieldLabels[FormField.deviceType]).required(),
            }),
        [FormField.isSelfEmployed]: Yup.string()
            .label(fieldLabels[FormField.isSelfEmployed])
            .when(FormField.isWorking, {
                is: true,
                then: Yup.string().label(fieldLabels[FormField.isSelfEmployed]).required(),
            }),
    });

export const foodValidationSchema = () =>
    Yup.object().shape({
        [FormField.isChild]: Yup.boolean(),
        [FormField.foodSecurityRate]: Yup.string()
            .label(fieldLabels[FormField.foodSecurityRate])
            .required(),
        [FormField.childNourish]: Yup.string()
            .label(fieldLabels[FormField.childNourish])
            .when(FormField.isChild, {
                is: true,
                then: Yup.string().label(fieldLabels[FormField.childNourish]).required(),
            }),
    });

export const empowermentValidationSchema = () =>
    Yup.object().shape({
        [FormField.memOfOrgan]: Yup.boolean(),
        [FormField.organization]: Yup.string()
            .label(fieldLabels[FormField.organization])
            .when(FormField.memOfOrgan, {
                is: true,
                then: Yup.string().label(fieldLabels[FormField.organization]).max(50).required(),
            }),
    });

export const surveyTypes: FormField[] = [
    FormField.health,
    FormField.education,
    FormField.social,
    FormField.livelihood,
    FormField.foodAndNutrition,
    FormField.empowerment,
    FormField.shelterAndCare,
];
export type TFormValues = typeof initialValues;
