import { FormikProps } from "formik";
import * as Yup from "yup";
export interface IFormProps {
    formikProps: FormikProps<any>;
}

export enum BaseSurveyFormField {
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
export const baseServicesTypes = [BaseSurveyFormField.health, BaseSurveyFormField.education, BaseSurveyFormField.social];

export const baseFieldLabels = {
    [BaseSurveyFormField.client]: "Client",
    [BaseSurveyFormField.surveyConsent]: "I give the consent to take the baseline survey",
    [BaseSurveyFormField.rateLevel]: "Health Level",
    [BaseSurveyFormField.health]: "Health",
    [BaseSurveyFormField.getService]:
        "I have access to rehabilitation services (e.g physiotherapy, speech therapy, training how to use assistive device)",
    [BaseSurveyFormField.needService]: "I need access to rehabilitation services",
    [BaseSurveyFormField.haveDevice]:
        "I have an assistive device (e.g wheelchair, crutches, prosthetic limbs, hearing aid)",
    [BaseSurveyFormField.deviceWorking]: "My assistive device is working well",
    [BaseSurveyFormField.needDevice]: "I need an assistive device",
    [BaseSurveyFormField.deviceType]: "Assistive Device",
    [BaseSurveyFormField.serviceSatisf]: "Satisfied Rate",

    [BaseSurveyFormField.education]: "Education",
    [BaseSurveyFormField.goSchool]: "I go to school",
    [BaseSurveyFormField.grade]: "Grade",
    [BaseSurveyFormField.reasonNotSchool]: "Reason",
    [BaseSurveyFormField.beenSchool]: "I have been to school before",
    [BaseSurveyFormField.wantSchool]: "I want to go to school",

    [BaseSurveyFormField.social]: "Social",
    [BaseSurveyFormField.feelValue]: "I feel valued as a member of my community",
    [BaseSurveyFormField.feelIndependent]: "I feel independent",
    [BaseSurveyFormField.ableInSocial]:
        "I am able to participate in community/social events (going to church, market, meeting friends)",
    [BaseSurveyFormField.disabiAffectSocial]: "My disability affects my ability to interact socially",
    [BaseSurveyFormField.disabiDiscrimination]: "I have experienced discrimination because of my disability",

    [BaseSurveyFormField.livelihood]: "Livelihood",
    [BaseSurveyFormField.isWorking]: "I am working",
    [BaseSurveyFormField.job]: "Job",
    [BaseSurveyFormField.meetFinanceNeeds]: "This meets my financial needs",
    [BaseSurveyFormField.disabiAffectWork]: "My disability affects my ability to go to work",
    [BaseSurveyFormField.wantWork]: "I want to work",
    [BaseSurveyFormField.isSelfEmployed]: "I am",

    [BaseSurveyFormField.foodAndNutrition]: "Food and Nutrition",
    [BaseSurveyFormField.foodSecurityRate]: "Rate",
    [BaseSurveyFormField.enoughFoodPerMonth]: "I have enough food every month",
    [BaseSurveyFormField.isChild]: "I am a child or have a child",
    [BaseSurveyFormField.childNourish]: "Nourishment",

    [BaseSurveyFormField.empowerment]: "Empowerment",
    [BaseSurveyFormField.memOfOrgan]:
        "I am a member of some organisations which assist people with disabilities",
    [BaseSurveyFormField.organization]: "Organization",
    [BaseSurveyFormField.awareRight]: "I am aware of my rights as a citizen living with disabilities",
    [BaseSurveyFormField.ableInfluence]: "I feel like I am able to influence people around me",

    [BaseSurveyFormField.shelterAndCare]: "Shelter and Care",
    [BaseSurveyFormField.haveShelter]: "I have adequate shelter",
    [BaseSurveyFormField.accessItem]: "I have access to essential items for my household",
};

export const baseInitialValues = {
    [BaseSurveyFormField.client]: 0,
    [BaseSurveyFormField.surveyConsent]: false,

    [BaseSurveyFormField.rateLevel]: "",
    [BaseSurveyFormField.getService]: false,
    [BaseSurveyFormField.needService]: false,
    [BaseSurveyFormField.haveDevice]: false,
    [BaseSurveyFormField.deviceWorking]: false,
    [BaseSurveyFormField.needDevice]: false,
    [BaseSurveyFormField.deviceType]: "",
    [BaseSurveyFormField.serviceSatisf]: "",

    [BaseSurveyFormField.goSchool]: false,
    [BaseSurveyFormField.grade]: 0,
    [BaseSurveyFormField.reasonNotSchool]: "",
    [BaseSurveyFormField.beenSchool]: false,
    [BaseSurveyFormField.wantSchool]: false,

    [BaseSurveyFormField.feelValue]: false,
    [BaseSurveyFormField.feelIndependent]: false,
    [BaseSurveyFormField.ableInSocial]: false,
    [BaseSurveyFormField.disabiAffectSocial]: false,
    [BaseSurveyFormField.disabiDiscrimination]: false,

    [BaseSurveyFormField.isWorking]: false,
    [BaseSurveyFormField.job]: "",
    [BaseSurveyFormField.isSelfEmployed]: "",
    [BaseSurveyFormField.meetFinanceNeeds]: false,
    [BaseSurveyFormField.disabiAffectWork]: false,
    [BaseSurveyFormField.wantWork]: false,

    [BaseSurveyFormField.foodSecurityRate]: "",
    [BaseSurveyFormField.enoughFoodPerMonth]: false,
    [BaseSurveyFormField.isChild]: false,
    [BaseSurveyFormField.childNourish]: "",

    [BaseSurveyFormField.memOfOrgan]: false,
    [BaseSurveyFormField.organization]: "",
    [BaseSurveyFormField.awareRight]: false,
    [BaseSurveyFormField.ableInfluence]: false,

    [BaseSurveyFormField.haveShelter]: false,
    [BaseSurveyFormField.accessItem]: false,
};

export const emptyValidationSchema = () => Yup.object().shape({});
export const healthValidationSchema = () =>
    Yup.object().shape({
        [BaseSurveyFormField.needDevice]: Yup.boolean(),
        [BaseSurveyFormField.serviceSatisf]: Yup.string()
            .label(baseFieldLabels[BaseSurveyFormField.serviceSatisf])
            .required(),
        [BaseSurveyFormField.rateLevel]: Yup.string().label(baseFieldLabels[BaseSurveyFormField.rateLevel]).required(),
        [BaseSurveyFormField.deviceType]: Yup.string()
            .label(baseFieldLabels[BaseSurveyFormField.deviceType])
            .when(BaseSurveyFormField.needDevice, {
                is: true,
                then: Yup.string().label(baseFieldLabels[BaseSurveyFormField.deviceType]).required(),
            }),
    });

export const educationValidationSchema = () =>
    Yup.object().shape({
        [BaseSurveyFormField.goSchool]: Yup.boolean(),
        [BaseSurveyFormField.reasonNotSchool]: Yup.string()
            .label(baseFieldLabels[BaseSurveyFormField.reasonNotSchool])
            .when(BaseSurveyFormField.goSchool, {
                is: false,
                then: Yup.string().label(baseFieldLabels[BaseSurveyFormField.reasonNotSchool]).required(),
            }),
        [BaseSurveyFormField.grade]: Yup.string()
            .label(baseFieldLabels[BaseSurveyFormField.grade])
            .when(BaseSurveyFormField.goSchool, {
                is: true,
                then: Yup.string().label(baseFieldLabels[BaseSurveyFormField.grade]).required(),
            }),
    });

export const livelihoodValidationSchema = () =>
    Yup.object().shape({
        [BaseSurveyFormField.isWorking]: Yup.boolean(),
        [BaseSurveyFormField.job]: Yup.string()
            .label(baseFieldLabels[BaseSurveyFormField.job])
            .when(BaseSurveyFormField.isWorking, {
                is: true,
                then: Yup.string().label(baseFieldLabels[BaseSurveyFormField.job]).required(),
            }),
        [BaseSurveyFormField.isSelfEmployed]: Yup.string()
            .label(baseFieldLabels[BaseSurveyFormField.isSelfEmployed])
            .when(BaseSurveyFormField.isWorking, {
                is: true,
                then: Yup.string().label(baseFieldLabels[BaseSurveyFormField.isSelfEmployed]).required(),
            }),
    });

export const foodValidationSchema = () =>
    Yup.object().shape({
        [BaseSurveyFormField.isChild]: Yup.boolean(),
        [BaseSurveyFormField.foodSecurityRate]: Yup.string()
            .label(baseFieldLabels[BaseSurveyFormField.foodSecurityRate])
            .required(),
        [BaseSurveyFormField.childNourish]: Yup.string()
            .label(baseFieldLabels[BaseSurveyFormField.childNourish])
            .when(BaseSurveyFormField.isChild, {
                is: true,
                then: Yup.string().label(baseFieldLabels[BaseSurveyFormField.childNourish]).required(),
            }),
    });

export const empowermentValidationSchema = () =>
    Yup.object().shape({
        [BaseSurveyFormField.memOfOrgan]: Yup.boolean(),
        [BaseSurveyFormField.organization]: Yup.string()
            .label(baseFieldLabels[BaseSurveyFormField.organization])
            .when(BaseSurveyFormField.memOfOrgan, {
                is: true,
                then: Yup.string().label(baseFieldLabels[BaseSurveyFormField.organization]).max(50).required(),
            }),
    });

export const surveyTypes: BaseSurveyFormField[] = [
    BaseSurveyFormField.health,
    BaseSurveyFormField.education,
    BaseSurveyFormField.social,
    BaseSurveyFormField.livelihood,
    BaseSurveyFormField.foodAndNutrition,
    BaseSurveyFormField.empowerment,
    BaseSurveyFormField.shelterAndCare,
];
export type BaseFormValues = typeof baseInitialValues;
