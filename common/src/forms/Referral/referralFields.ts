import { FormikProps } from "formik";
import { InjuryLocation, WheelchairExperience } from "../../util/referrals";
import { getDisabilities, getOtherDisabilityId } from "../../util/hooks/disabilities";
import * as Yup from "yup";

export interface ReferralFormProps {
    formikProps: FormikProps<any>;
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
    servicesOther = "services_other",
    otherDescription = "other_description",
}

export const referralServicesTypes = [
    ReferralFormField.wheelchair,
    ReferralFormField.physiotherapy,
    ReferralFormField.prosthetic,
    ReferralFormField.orthotic,
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
    [ReferralFormField.servicesOther]: "Other Services",
    [ReferralFormField.otherDescription]: "Service Description",
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
    ReferralFormField.servicesOther,
];

export interface IReferralForm {
    label: string;
    Form: (props: ReferralFormProps) => JSX.Element;
    validationSchema: () => any;
}
export type ReferralFormValues = typeof referralInitialValues;
