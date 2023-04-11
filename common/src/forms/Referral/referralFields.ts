import { FormikProps } from "formik";
import { InjuryLocation, WheelchairExperience } from "../../util/referrals";
import { getDisabilities, getOtherDisabilityId } from "../../util/hooks/disabilities";
import * as Yup from "yup";

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

    hhaNutritionAndAgricultureProject = "hha_nutrition_and_agriculture_project",
    emergencyFoodAidRequired = "emergency_food_aid",
    agricultureLivelihoodProgramEnrollment = "agriculture_livelihood_program_enrollment",

    servicesOther = "services_other",
    otherDescription = "other_description",
}

export const referralServicesTypes = [
    ReferralFormField.wheelchair,
    ReferralFormField.physiotherapy,
    ReferralFormField.prosthetic,
    ReferralFormField.orthotic,

    ReferralFormField.hhaNutritionAndAgricultureProject,

    ReferralFormField.servicesOther,
];

export const referralFieldLabels = {
    [ReferralFormField.client_id]: "Client",
    [ReferralFormField.wheelchair]: "Wheelchair",
    [ReferralFormField.wheelchairExperience]: "Wheelchair Experience",
    [ReferralFormField.picture]: "picture",
    [ReferralFormField.hipWidth]: "Hip Width",
    [ReferralFormField.wheelchairOwned]: "Client Owns a Wheelchair",
    [ReferralFormField.wheelchairRepairable]: "Client's Wheelchair is Repairable",
    [ReferralFormField.physiotherapy]: "Physiotherapy",
    [ReferralFormField.condition]: "Condition",
    [ReferralFormField.conditionOther]: "Other Condition",
    [ReferralFormField.prosthetic]: "Prosthetic",
    [ReferralFormField.prostheticInjuryLocation]: "Prosthetic Injury Location",
    [ReferralFormField.orthotic]: "Orthotic",
    [ReferralFormField.orthoticInjuryLocation]: "Orthotic Injury Location",

    [ReferralFormField.hhaNutritionAndAgricultureProject]: "HHA Nutrition/Agriculture Project",
    [ReferralFormField.emergencyFoodAidRequired]: "Emergency Food Aid",
    [ReferralFormField.agricultureLivelihoodProgramEnrollment]:
        "Agriculture Livelihood Program Enrollment",

    [ReferralFormField.servicesOther]: "Other Services",
    [ReferralFormField.otherDescription]: "Service Description",
};

export const referralStatsChartLabels = {
    [ReferralFormField.wheelchair]: "Wheelchair",
    [ReferralFormField.physiotherapy]: "Physiotherapy",
    [ReferralFormField.orthotic]: "Orthotic",
    [ReferralFormField.prosthetic]: "Prosthetic",
    [ReferralFormField.hhaNutritionAndAgricultureProject]: "HHANAP",
    [ReferralFormField.servicesOther]: "Other Services",
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
    [ReferralFormField.prostheticInjuryLocation]: InjuryLocation.BELOW,
    [ReferralFormField.orthotic]: false,
    [ReferralFormField.orthoticInjuryLocation]: InjuryLocation.BELOW,

    [ReferralFormField.hhaNutritionAndAgricultureProject]: false,
    [ReferralFormField.emergencyFoodAidRequired]: false,
    [ReferralFormField.agricultureLivelihoodProgramEnrollment]: false,

    [ReferralFormField.servicesOther]: false,
    [ReferralFormField.otherDescription]: "",
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
                "Other Condition is required",
                async (conditionOther, schema) =>
                    !(await isOtherCondition(schema.parent.condition)) ||
                    (conditionOther !== undefined && conditionOther.length > 0)
            )
            .test(
                "require-if-other-selected",
                "Other Condition must be at most 100 characters",
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
        .test("require-atleast-one-checkbox", "At least one checkbox must be selected", (obj) => {
            if (
                obj[ReferralFormField.agricultureLivelihoodProgramEnrollment] ||
                obj[ReferralFormField.emergencyFoodAidRequired]
            ) {
                return true;
            }

            return new Yup.ValidationError("Please select one option", null, "custom");
        });

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
    ReferralFormField.servicesOther,
];

export interface IReferralForm {
    label: string;
    Form: (props: ReferralFormProps) => JSX.Element;
    validationSchema: () => any;
}
export type ReferralFormValues = typeof referralInitialValues;
