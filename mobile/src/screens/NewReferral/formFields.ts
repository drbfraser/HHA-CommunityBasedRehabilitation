import {
    getDisabilities,
    getOtherDisabilityId,
    InjuryLocation,
    WheelchairExperience,
} from "@cbr/common";
import { FormikProps } from "formik";
import * as Yup from "yup";

export interface IFormProps {
    formikProps: FormikProps<any>;
}

export enum FormField {
    client = "client",
    wheelchair = "wheelchair",
    wheelchairExperience = "wheelchair_experience",
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

export const servicesTypes = [
    FormField.wheelchair,
    FormField.physiotherapy,
    FormField.prosthetic,
    FormField.orthotic,
    FormField.servicesOther,
];

export const fieldLabels = {
    [FormField.client]: "Client",
    [FormField.wheelchair]: "Wheelchair",
    [FormField.wheelchairExperience]: "Wheelchair Experience",
    [FormField.hipWidth]: "Hip Width",
    [FormField.wheelchairOwned]: "Client Owns a Wheelchair",
    [FormField.wheelchairRepairable]: "Client's Wheelchair is Repairable",
    [FormField.physiotherapy]: "Physiotherapy",
    [FormField.condition]: "Condition",
    [FormField.conditionOther]: "Other Condition",
    [FormField.prosthetic]: "Prosthetic",
    [FormField.prostheticInjuryLocation]: "Prosthetic Injury Location",
    [FormField.orthotic]: "Orthotic",
    [FormField.orthoticInjuryLocation]: "Orthotic Injury Location",
    [FormField.servicesOther]: "Other Services",
    [FormField.otherDescription]: "Service Description",
};

export const initialValues = {
    [FormField.client]: 0,
    [FormField.wheelchairExperience]: WheelchairExperience.BASIC,
    [FormField.hipWidth]: "",
    [FormField.wheelchair]: false,
    [FormField.wheelchairOwned]: false,
    [FormField.wheelchairRepairable]: false,
    [FormField.physiotherapy]: false,
    [FormField.condition]: "",
    [FormField.conditionOther]: "",
    [FormField.prosthetic]: false,
    [FormField.prostheticInjuryLocation]: InjuryLocation.BELOW,
    [FormField.orthotic]: false,
    [FormField.orthoticInjuryLocation]: InjuryLocation.BELOW,
    [FormField.servicesOther]: false,
    [FormField.otherDescription]: "",
};

export const initialValidationSchema = () => Yup.object().shape({});

export const wheelchairValidationSchema = () =>
    Yup.object().shape({
        [FormField.wheelchairExperience]: Yup.string()
            .label(fieldLabels[FormField.wheelchairExperience])
            .required(),
        [FormField.hipWidth]: Yup.number()
            .label(fieldLabels[FormField.hipWidth])
            .max(200)
            .positive()
            .required(),
    });

const isOtherCondition = async (condition: number) =>
    Number(condition) === Number(getOtherDisabilityId(await getDisabilities()));

export const physiotherapyValidationSchema = () =>
    Yup.object().shape({
        [FormField.condition]: Yup.string()
            .label(fieldLabels[FormField.condition])
            .max(100)
            .required(),
        [FormField.conditionOther]: Yup.string()
            .label(fieldLabels[FormField.conditionOther])
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

export const prostheticOrthoticValidationSchema = (serviceType: FormField) =>
    Yup.object().shape({
        [`${serviceType}_injury_location`]: Yup.string()
            .label(fieldLabels[`${serviceType}_injury_location` as FormField])
            .required(),
    });

export const otherServicesValidationSchema = () =>
    Yup.object().shape({
        [FormField.otherDescription]: Yup.string()
            .label(fieldLabels[FormField.otherDescription])
            .max(100)
            .trim()
            .required(),
    });

export type TFormValues = typeof initialValues;
