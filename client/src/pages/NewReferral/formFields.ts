import * as Yup from "yup";
import { InjuryLocation, WheelchairExperience } from "util/referrals";

export enum FormField {
    client = "client",
    wheelchair = "wheelchair",
    wheelchairExperience = "wheelchair_experience",
    hipWidth = "hip_width",
    wheelchairOwned = "wheelchair_owned",
    wheelchairRepairable = "wheelchair_repairable",
    physiotherapy = "physiotherapy",
    condition = "condition",
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
    [FormField.wheelchairRepairable]: "Client's Wheelchair Needs Repair",
    [FormField.physiotherapy]: "Physiotherapy",
    [FormField.condition]: "Condition",
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
    [FormField.hipWidth]: 35,
    [FormField.wheelchair]: false,
    [FormField.wheelchairOwned]: false,
    [FormField.wheelchairRepairable]: false,
    [FormField.physiotherapy]: false,
    [FormField.condition]: "",
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

export const physiotherapyValidationSchema = () =>
    Yup.object().shape({
        [FormField.condition]: Yup.string().label(fieldLabels[FormField.condition]).required(),
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
            .required(),
    });

export type TFormValues = typeof initialValues;
