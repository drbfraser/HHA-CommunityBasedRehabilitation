import * as Yup from "yup";


export enum ZoneField {
    zone_name = "zone_name",
}

export const zoneFieldLabels = {
    [ZoneField.zone_name]: "Zone",
};

export const zoneInitialValues = {
    [ZoneField.zone_name]: "",
};

export type TNewZoneValues = typeof zoneInitialValues;

const infoValidationShape = {
    [ZoneField.zone_name]: Yup.string().label(zoneFieldLabels[ZoneField.zone_name]).required(),
};

export const newUserValidationSchema = Yup.object().shape({
    ...infoValidationShape,
});
export const editUserValidationSchema = Yup.object().shape(infoValidationShape);
