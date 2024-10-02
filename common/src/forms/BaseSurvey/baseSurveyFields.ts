import { FormikProps } from "formik";
import * as Yup from "yup";
import i18n from "i18next";
export interface IFormProps {
    formikProps: FormikProps<any>;
}

/* Fields specifically used in schema & model of local DB */
export enum BaseSurveyField {
    survey_date = "survey_date",
    health = "health",
    health_have_rehabilitation_access = "health_have_rehabilitation_access",
    health_need_rehabilitation_access = "health_need_rehabilitation_access",
    health_have_mental_condition = "health_have_mental_condition",
    health_have_assistive_device = "health_have_assistive_device",
    health_working_assistive_device = "health_working_assistive_device",
    health_need_assistive_device = "health_need_assistive_device",
    health_services_satisfaction = "health_services_satisfaction",
    health_assistive_device_type = "health_assistive_device_type",
    school_currently_attend = "school_currently_attend",
    school_grade = "school_grade",
    school_not_attend_reason = "school_not_attend_reason",
    school_ever_attend = "school_ever_attend",
    school_want_attend = "school_want_attend",
    social_community_valued = "social_community_valued",
    social_independent = "social_independent",
    social_able_participate = "social_able_participate",
    social_affected_by_disability = "social_affected_by_disability",
    social_discrimination = "social_discrimination",
    work = "work",
    work_what = "work_what",
    work_status = "work_status",
    work_meet_financial_needs = "work_meet_financial_needs",
    work_affected_by_disability = "work_affected_by_disability",
    work_want = "work_want",
    food_security = "food_security",
    food_enough_monthly = "food_enough_monthly",
    food_enough_for_child = "food_enough_for_child",
    empowerment_organization_member = "empowerment_organization_member",
    empowerment_organization = "empowerment_organization",
    empowerment_rights_awareness = "empowerment_rights_awareness",
    empowerment_influence_others = "empowerment_influence_others",
    shelter_adequate = "shelter_adequate",
    shelter_essential_access = "shelter_essential_access",
}

export enum BaseSurveyFormField {
    client_id = "client_id",
    surveyConsent = "give_consent",

    health = "health",
    rateLevel = "rate_level",
    getService = "get_service",
    needService = "need_service",
    mentalHealth = "mental_health",
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

export const baseServicesTypes = [
    BaseSurveyFormField.health,
    BaseSurveyFormField.education,
    BaseSurveyFormField.social,
];

// On language change, recompute arrays of labels
export var baseFieldLabels: { [key: string]: string } = {};
const refreshArrays = () => {
    baseFieldLabels = {
        [BaseSurveyFormField.client_id]: i18n.t("baseSurveyFields.client_id"),
        [BaseSurveyFormField.surveyConsent]: i18n.t("baseSurveyFields.surveyConsent"),
        [BaseSurveyFormField.rateLevel]: i18n.t("baseSurveyFields.rateLevel"),
        [BaseSurveyFormField.health]: i18n.t("baseSurveyFields.health"),
        [BaseSurveyFormField.getService]: i18n.t("baseSurveyFields.getService"),
        [BaseSurveyFormField.needService]: i18n.t("baseSurveyFields.needService"),
        [BaseSurveyFormField.mentalHealth]: i18n.t("baseSurveyFields.mentalHealth"),
        [BaseSurveyFormField.haveDevice]: i18n.t("baseSurveyFields.haveDevice"),
        [BaseSurveyFormField.deviceWorking]: i18n.t("baseSurveyFields.deviceWorking"),
        [BaseSurveyFormField.needDevice]: i18n.t("baseSurveyFields.needDevice"),
        [BaseSurveyFormField.deviceType]: i18n.t("baseSurveyFields.deviceType"),
        [BaseSurveyFormField.serviceSatisf]: i18n.t("baseSurveyFields.serviceSatisf"),
        [BaseSurveyFormField.education]: i18n.t("baseSurveyFields.education"),
        [BaseSurveyFormField.goSchool]: i18n.t("baseSurveyFields.goSchool"),
        [BaseSurveyFormField.grade]: i18n.t("baseSurveyFields.grade"),
        [BaseSurveyFormField.reasonNotSchool]: i18n.t("baseSurveyFields.reasonNotSchool"),
        [BaseSurveyFormField.beenSchool]: i18n.t("baseSurveyFields.beenSchool"),
        [BaseSurveyFormField.wantSchool]: i18n.t("baseSurveyFields.wantSchool"),
        [BaseSurveyFormField.social]: i18n.t("baseSurveyFields.social"),
        [BaseSurveyFormField.feelValue]: i18n.t("baseSurveyFields.feelValue"),
        [BaseSurveyFormField.feelIndependent]: i18n.t("baseSurveyFields.feelIndependent"),
        [BaseSurveyFormField.ableInSocial]: i18n.t("baseSurveyFields.ableInSocial"),
        [BaseSurveyFormField.disabiAffectSocial]: i18n.t("baseSurveyFields.disabiAffectSocial"),
        [BaseSurveyFormField.disabiDiscrimination]: i18n.t("baseSurveyFields.disabiDiscrimination"),
        [BaseSurveyFormField.livelihood]: i18n.t("baseSurveyFields.livelihood"),
        [BaseSurveyFormField.isWorking]: i18n.t("baseSurveyFields.isWorking"),
        [BaseSurveyFormField.job]: i18n.t("baseSurveyFields.job"),
        [BaseSurveyFormField.meetFinanceNeeds]: i18n.t("baseSurveyFields.meetFinanceNeeds"),
        [BaseSurveyFormField.disabiAffectWork]: i18n.t("baseSurveyFields.disabiAffectWork"),
        [BaseSurveyFormField.wantWork]: i18n.t("baseSurveyFields.wantWork"),
        [BaseSurveyFormField.isSelfEmployed]: i18n.t("baseSurveyFields.isSelfEmployed"),
        [BaseSurveyFormField.foodAndNutrition]: i18n.t("baseSurveyFields.foodAndNutrition"),
        [BaseSurveyFormField.foodSecurityRate]: i18n.t("baseSurveyFields.foodSecurityRate"),
        [BaseSurveyFormField.enoughFoodPerMonth]: i18n.t("baseSurveyFields.enoughFoodPerMonth"),
        [BaseSurveyFormField.isChild]: i18n.t("baseSurveyFields.isChild"),
        [BaseSurveyFormField.childNourish]: i18n.t("baseSurveyFields.childNourish"),
        [BaseSurveyFormField.empowerment]: i18n.t("baseSurveyFields.empowerment"),
        [BaseSurveyFormField.memOfOrgan]: i18n.t("baseSurveyFields.memOfOrgan"),
        [BaseSurveyFormField.organization]: i18n.t("baseSurveyFields.organization"),
        [BaseSurveyFormField.awareRight]: i18n.t("baseSurveyFields.awareRight"),
        [BaseSurveyFormField.ableInfluence]: i18n.t("baseSurveyFields.ableInfluence"),
        [BaseSurveyFormField.shelterAndCare]: i18n.t("baseSurveyFields.shelterAndCare"),
        [BaseSurveyFormField.haveShelter]: i18n.t("baseSurveyFields.haveShelter"),
        [BaseSurveyFormField.accessItem]: i18n.t("baseSurveyFields.accessItem"),
    };
};
refreshArrays();
i18n.on("languageChanged", () => {
    refreshArrays();
});

export const baseInitialValues = {
    [BaseSurveyFormField.client_id]: 0,
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

    [BaseSurveyFormField.mentalHealth]: false,
};

export const emptyValidationSchema = () => Yup.object().shape({});
export const healthValidationSchema = () =>
    Yup.object().shape({
        [BaseSurveyFormField.needDevice]: Yup.boolean(),
        [BaseSurveyFormField.serviceSatisf]: Yup.string()
            .label(baseFieldLabels[BaseSurveyFormField.serviceSatisf])
            .required(),
        [BaseSurveyFormField.rateLevel]: Yup.string()
            .label(baseFieldLabels[BaseSurveyFormField.rateLevel])
            .required(),
        [BaseSurveyFormField.deviceType]: Yup.string()
            .label(baseFieldLabels[BaseSurveyFormField.deviceType])
            .when(BaseSurveyFormField.needDevice, {
                is: true,
                then: Yup.string()
                    .label(baseFieldLabels[BaseSurveyFormField.deviceType])
                    .required(),
            }),
    });

export const educationValidationSchema = () =>
    Yup.object().shape({
        [BaseSurveyFormField.goSchool]: Yup.boolean(),
        [BaseSurveyFormField.reasonNotSchool]: Yup.string()
            .label(baseFieldLabels[BaseSurveyFormField.reasonNotSchool])
            .when(BaseSurveyFormField.goSchool, {
                is: false,
                then: Yup.string()
                    .label(baseFieldLabels[BaseSurveyFormField.reasonNotSchool])
                    .required(),
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
        [BaseSurveyFormField.meetFinanceNeeds]: Yup.boolean()
            .label(baseFieldLabels[BaseSurveyFormField.meetFinanceNeeds])
            .required(),
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
                then: Yup.string()
                    .label(baseFieldLabels[BaseSurveyFormField.isSelfEmployed])
                    .required(),
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
                then: Yup.string()
                    .label(baseFieldLabels[BaseSurveyFormField.childNourish])
                    .required(),
            }),
    });

export const empowermentValidationSchema = () =>
    Yup.object().shape({
        [BaseSurveyFormField.memOfOrgan]: Yup.boolean(),
        [BaseSurveyFormField.organization]: Yup.string()
            .label(baseFieldLabels[BaseSurveyFormField.organization])
            .when(BaseSurveyFormField.memOfOrgan, {
                is: true,
                then: Yup.string()
                    .label(baseFieldLabels[BaseSurveyFormField.organization])
                    .max(50)
                    .required(),
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
