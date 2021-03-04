import * as Yup from "yup";
import { Validation } from "util/validations";

export interface IRouteParams {
    userId: string;
}
export interface IUser {
    username: string;
    password: string;
    id: number;
    zone: number;
    first_name: string;
    last_name: string;
    phone_number: string;
    is_active: boolean;
    type: string;
}

export enum Type {
    ADMIN = "A",
    WORKER = "W",
}
export const workerOptions = {
    [Type.ADMIN]: "Admin",
    [Type.WORKER]: "Worker",
};

export enum AdminField {
    username = "username",
    password = "password",
    userID = "id",
    first_name = "first_name",
    last_name = "last_name",
    zone = "zone",
    phone_number = "phone_number",
    type = "type",
    is_active = "is_active",
}
export const fieldLabels = {
    [AdminField.username]: "Username",
    [AdminField.password]: "Password",
    [AdminField.userID]: "ID",
    [AdminField.first_name]: "First Name",
    [AdminField.last_name]: "Last Name",
    [AdminField.zone]: "Zone",
    [AdminField.type]: "Type",
    [AdminField.phone_number]: "Phone Number",
    [AdminField.is_active]: "Status",
};
export const initialValues = {
    [AdminField.username]: "",
    [AdminField.password]: "",
    [AdminField.userID]: "",
    [AdminField.first_name]: "",
    [AdminField.last_name]: "",
    [AdminField.zone]: "",
    [AdminField.type]: "",
    [AdminField.is_active]: "Active",
    [AdminField.phone_number]: "",
};

export type TFormValues = typeof initialValues;
// We need to separate the schema for new and edit
export const validationNewSchema = () =>
    Yup.object().shape({
        [AdminField.first_name]: Yup.string()
            .label(fieldLabels[AdminField.first_name])
            .required()
            .max(50),
        [AdminField.last_name]: Yup.string()
            .label(fieldLabels[AdminField.last_name])
            .required()
            .max(50),
        [AdminField.username]: Yup.string()
            .label(fieldLabels[AdminField.username])
            .required()
            .max(50),
        [AdminField.password]: Yup.string()
            .label(fieldLabels[AdminField.password])
            .min(8)
            .required(),
        [AdminField.zone]: Yup.string().label(fieldLabels[AdminField.zone]).required(),
        [AdminField.phone_number]: Yup.string()
            .matches(Validation.phoneRegExp, "Phone number is not valid")
            .label(fieldLabels[AdminField.phone_number])
            .max(50)
            .required(),
        [AdminField.type]: Yup.string().label(fieldLabels[AdminField.type]).required(),
        [AdminField.is_active]: Yup.string().label(fieldLabels[AdminField.is_active]).required(),
    });

export const validationEditSchema = () =>
    Yup.object().shape({
        [AdminField.first_name]: Yup.string()
            .label(fieldLabels[AdminField.first_name])
            .required()
            .max(50),
        [AdminField.last_name]: Yup.string()
            .label(fieldLabels[AdminField.last_name])
            .required()
            .max(50),
        [AdminField.username]: Yup.string().label(fieldLabels[AdminField.username]).max(50),
        [AdminField.zone]: Yup.string().label(fieldLabels[AdminField.zone]).required(),
        [AdminField.phone_number]: Yup.string()
            .matches(Validation.phoneRegExp, "Phone number is not valid")
            .label(fieldLabels[AdminField.phone_number])
            .max(50)
            .required(),
        // [AdminField.type]: Yup.string().label(fieldLabels[AdminField.type]),
        // [AdminField.is_active]: Yup.string().label(fieldLabels[AdminField.is_active]),
    });
