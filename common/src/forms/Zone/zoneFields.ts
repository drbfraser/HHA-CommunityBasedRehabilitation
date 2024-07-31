import * as Yup from "yup";
import i18n from "i18next";

export interface IRouteParams {
    zone_name: string;
}

export enum ZoneField {
    zone_name = "zone_name",
}

export const zoneFieldLabels = {
    [ZoneField.zone_name]: i18n.t("zone.zone"),
};

export const zoneInitialValues = {
    [ZoneField.zone_name]: "",
};

export type TNewZoneValues = typeof zoneInitialValues;

const infoValidationShape = {
    [ZoneField.zone_name]: Yup.string().label(zoneFieldLabels[ZoneField.zone_name]).required(),
};

export const newZoneValidationSchema = Yup.object().shape({
    ...infoValidationShape,
});
export const editZoneValidationSchema = Yup.object().shape(infoValidationShape);
