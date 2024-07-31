import { FormikProps } from "formik";
import {
    Impairments,
    InjuryLocation,
    MentalConditions,
    WheelchairExperience,
    mentalHealthConditions,
    orthoticInjury,
    otherServices,
} from "../../util/referrals";
import { getDisabilities, getOtherDisabilityId } from "../../util/hooks/disabilities";
import * as Yup from "yup";
import i18n from "i18next";

export interface ReferralFormProps {
    formikProps: FormikProps<any>;
}

/* Fields specifically used in schema & model of local DB */
export enum ReferralField {
    date_referred = "date_referred",
    date_resolved = "date_resolved",
    resolved = "resolved",
    outcome = "outcome",
    picture = "picture",
    wheelchair = "wheelchair",
    wheelchair_experience = "wheelchair_experience",
    hip_width = "hip_width",
    wheelchair_owned = "wheelchair_owned",
    wheelchair_repairable = "wheelchair_repairable",
    physiotherapy = "physiotherapy",
    condition = "condition",
    prosthetic = "prosthetic",
    prosthetic_injury_location = "prosthetic_injury_location",
    orthotic = "orthotic",
    orthotic_injury_location = "orthotic_injury_location",

    mental_health = "mental_health",
    mental_health_condition = "mental_health_condition",
    mental_condition_other = "mental_condition_other",

    hha_nutrition_and_agriculture_project = "hha_nutrition_and_agriculture_project",
    emergency_food_aid = "emergency_food_aid",
    agriculture_livelihood_program_enrollment = "agriculture_livelihood_program_enrollment",

    services_other = "services_other",
}

export enum ReferralFormField {
    client_id = "client_id",
    wheelchair = "wheelchair",
    wheelchairExperience = "wheelchair_experience",
    picture = "picture",
    hipWidth = "hip_width",
    wheelchairOwned = "wheelchair_owned",
    wheelchairRepairable = "wheelchair_repairable",
    physiotherapy = "physiotherapy",
    condition = "condition",
    conditionOther = "condition_other",
    prosthetic = "prosthetic",
    prostheticInjuryLocation = "prosthetic_injury_location",
    orthotic = "orthotic",
    orthoticInjuryLocation = "orthotic_injury_location",

    mentalHealth = "mental_health",
    mentalHealthCondition = "mental_health_condition",
    mentalConditionOther = "mental_condition_other",

    hhaNutritionAndAgricultureProject = "hha_nutrition_and_agriculture_project",
    emergencyFoodAidRequired = "emergency_food_aid",
    agricultureLivelihoodProgramEnrollment = "agriculture_livelihood_program_enrollment",

    servicesOther = "services_other",
    referralOther = "referral_other",
    otherDescription = "other_description",
}

export const referralServicesTypes = [
    ReferralFormField.wheelchair,
    ReferralFormField.physiotherapy,
    ReferralFormField.prosthetic,
    ReferralFormField.orthotic,
    ReferralFormField.mentalHealth,
    ReferralFormField.hhaNutritionAndAgricultureProject,
    ReferralFormField.servicesOther,
];

export const referralFieldLabels = {
    [ReferralFormField.client_id]: i18n.t("common.referral.client_id"),
    [ReferralFormField.wheelchair]: i18n.t("common.referral.wheelchair"),
    [ReferralFormField.wheelchairExperience]: i18n.t("common.referral.wheelchairExperience"),
    [ReferralFormField.picture]: i18n.t("common.referral.picture"),
    [ReferralFormField.hipWidth]: i18n.t("common.referral.hipWidth"),
    [ReferralFormField.wheelchairOwned]: i18n.t("common.referral.wheelchairOwned"),
    [ReferralFormField.wheelchairRepairable]: i18n.t("common.referral.wheelchairRepairable"),
    [ReferralFormField.physiotherapy]: i18n.t("common.referral.physiotherapy"),
    [ReferralFormField.condition]: i18n.t("common.referral.condition"),
    [ReferralFormField.conditionOther]: i18n.t("common.referral.conditionOther"),
    [ReferralFormField.prosthetic]: i18n.t("common.referral.prosthetic"),
    [ReferralFormField.prostheticInjuryLocation]: i18n.t("common.referral.prostheticInjuryLocation"),
    [ReferralFormField.orthotic]: i18n.t("common.referral.orthotic"),
    [ReferralFormField.orthoticInjuryLocation]: i18n.t("common.referral.orthoticInjuryLocation"),

    [ReferralFormField.mentalHealth]: i18n.t("common.referral.mentalHealth"),
    [ReferralFormField.mentalHealthCondition]: i18n.t("common.referral.mentalHealthCondition"),
    [ReferralFormField.mentalConditionOther]: i18n.t("common.referral.mentalConditionOther"),

    [ReferralFormField.hhaNutritionAndAgricultureProject]: i18n.t("common.referral.hhaNutritionAndAgricultureProject"),
    [ReferralFormField.emergencyFoodAidRequired]: i18n.t("common.referral.emergencyFoodAidRequired"),
    [ReferralFormField.agricultureLivelihoodProgramEnrollment]: i18n.t("common.referral.agricultureLivelihoodProgramEnrollment"),

    [ReferralFormField.servicesOther]: i18n.t("common.referral.servicesOther"),
    [ReferralFormField.otherDescription]: i18n.t("common.referral.otherDescription"),
    [ReferralFormField.referralOther]: i18n.t("common.referral.referralOther"),
};

export const referralStatsChartLabels = {
    [ReferralFormField.wheelchair]: i18n.t("common.referral.wheelchair"),
    [ReferralFormField.physiotherapy]: i18n.t("common.referral.physiotherapy"),
    [ReferralFormField.orthotic]: i18n.t("common.referral.orthotic"),
    [ReferralFormField.prosthetic]: i18n.t("common.referral.prosthetic"),
    [ReferralFormField.hhaNutritionAndAgricultureProject]: i18n.t("common.referral.hhaNutritionAndAgricultureProjectAbbr"),
    [ReferralFormField.mentalHealth]: i18n.t("common.referral.mentalHealth"),
    [ReferralFormField.servicesOther]: i18n.t("common.referral.servicesOther"),
};

export const referralInitialValues = {
    [ReferralFormField.client_id]: 0,
    [ReferralFormField.wheelchairExperience]: WheelchairExperience.BASIC,
    [ReferralFormField.hipWidth]: "",
    [ReferralFormField.picture]: "",
    [ReferralFormField.wheelchair]: false,
    [ReferralFormField.wheelchairOwned]: false,
    [ReferralFormField.wheelchairRepairable]: false,
    [ReferralFormField.physiotherapy]: false,
    [ReferralFormField.condition]: "",
    [ReferralFormField.conditionOther]: "",
    [ReferralFormField.prosthetic]: false,
    [ReferralFormField.prostheticInjuryLocation]: InjuryLocation.BELOW_KNEE,
    [ReferralFormField.orthotic]: false,
    [ReferralFormField.orthoticInjuryLocation]: orthoticInjury.WEAK_LEG,

    [ReferralFormField.mentalHealth]: false,
    [ReferralFormField.mentalHealthCondition]: "",
    [ReferralFormField.mentalConditionOther]: "",

    [ReferralFormField.hhaNutritionAndAgricultureProject]: false,
    [ReferralFormField.emergencyFoodAidRequired]: false,
    [ReferralFormField.agricultureLivelihoodProgramEnrollment]: false,

    [ReferralFormField.servicesOther]: false,
    [ReferralFormField.otherDescription]: "",
    [ReferralFormField.referralOther]: "",
};

export const referralInitialValidationSchema = () => Yup.object().shape({});

export const wheelchairValidationSchema = () =>
    Yup.object().shape({
        [ReferralFormField.wheelchairExperience]: Yup.string()
            .label(referralFieldLabels[ReferralFormField.wheelchairExperience])
            .required(),
        [ReferralFormField.hipWidth]: Yup.number()
            .label(referralFieldLabels[ReferralFormField.hipWidth])
            .max(200)
            .positive()
            .required(),
    });

const isOtherCondition = async (condition: number) =>
    Number(condition) === Number(getOtherDisabilityId(await getDisabilities()));

export const physiotherapyValidationSchema = () =>
    Yup.object().shape({
        [ReferralFormField.condition]: Yup.string()
            .label(referralFieldLabels[ReferralFormField.condition])
            .max(100)
            .required(),
        [ReferralFormField.conditionOther]: Yup.string()
            .label(referralFieldLabels[ReferralFormField.conditionOther])
            .trim()
            .test(
                "require-if-other-selected",
                i18n.t("common.referral.otherConditionRequired"),
                async (conditionOther, schema) =>
                    !(await isOtherCondition(schema.parent.condition)) ||
                    (conditionOther !== undefined && conditionOther.length > 0)
            )
            .test(
                "require-if-other-selected",
                i18n.t("common.referral.otherConditionAtMost100Char"),
                async (conditionOther, schema) =>
                    !(await isOtherCondition(schema.parent.condition)) ||
                    (conditionOther !== undefined && conditionOther.length <= 100)
            ),
    });

export const prostheticOrthoticValidationSchema = (serviceType: ReferralFormField) =>
    Yup.object().shape({
        [`${serviceType}_injury_location`]: Yup.string()
            .label(referralFieldLabels[`${serviceType}_injury_location` as ReferralFormField])
            .required(),
    });

const isOtherMentalCondition = (condition: string) => condition === MentalConditions.OTHER;
export const mentalHealthValidationSchema = () =>
    Yup.object().shape({
        [ReferralFormField.mentalHealthCondition]: Yup.string()
            .label(referralFieldLabels[ReferralFormField.mentalHealthCondition])
            .max(100)
            .required(),
        [ReferralFormField.mentalConditionOther]: Yup.string()
            .label(referralFieldLabels[ReferralFormField.mentalConditionOther])
            .trim()
            .test(
                "require-if-other-selected",
                i18n.t("common.referral.otherConditionRequired"),
                async (conditionOther) =>
                    !isOtherMentalCondition(conditionOther!) ||
                    (conditionOther !== undefined && conditionOther.length > 0)
            )
            .test(
                "require-if-other-selected",
                i18n.t("common.referral.mentalConditionAtMost100Char"),
                async (conditionOther) =>
                    !isOtherMentalCondition(conditionOther!) ||
                    (conditionOther !== undefined && conditionOther.length <= 100)
            ),
    });

export const hhaNutritionAndAgricultureProjectValidationSchema = () =>
    Yup.object()
        .shape({
            [ReferralFormField.agricultureLivelihoodProgramEnrollment]: Yup.boolean().label(
                referralFieldLabels[ReferralFormField.agricultureLivelihoodProgramEnrollment]
            ),
            [ReferralFormField.emergencyFoodAidRequired]: Yup.boolean().label(
                referralFieldLabels[ReferralFormField.emergencyFoodAidRequired]
            ),
        })
        .test(
            "require-atleast-one-checkbox", 
            i18n.t("common.referral.atLeastOneCheckbox"),
            (obj) => {
                if (
                    obj[ReferralFormField.agricultureLivelihoodProgramEnrollment] ||
                    obj[ReferralFormField.emergencyFoodAidRequired]
                ) {
                    return true;
                }

                return new Yup.ValidationError(i18n.t("common.referral.selectOneOption"), null, "custom");
            }
        );

export const otherServicesValidationSchema = () =>
    Yup.object().shape({
        [ReferralFormField.otherDescription]: Yup.string()
            .label(referralFieldLabels[ReferralFormField.otherDescription])
            .max(100)
            .trim()
            .required(),
    });
export const serviceTypes: ReferralFormField[] = [
    ReferralFormField.wheelchair,
    ReferralFormField.physiotherapy,
    ReferralFormField.prosthetic,
    ReferralFormField.orthotic,
    ReferralFormField.hhaNutritionAndAgricultureProject,
    ReferralFormField.mentalHealth,
    ReferralFormField.servicesOther,
];

export interface IReferralForm {
    label: string;
    Form: (props: ReferralFormProps) => JSX.Element;
    validationSchema: () => any;
}
export type ReferralFormValues = typeof referralInitialValues;
