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

export const workerOptions = [
    {
        name: "Admin",
        value: "A",
    },
    {
        name: "Worker",
        value: "W",
    },
];

export enum AdminField {
    username = "username",
    password = "password",
    userID = "id",
    first_name = "first_name",
    last_name = "last_name",
    zone = "zone",
    phone_number = "phone_number",
    type = "type",
    status = "status",
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
    [AdminField.status]: "Status",
};
export const initialValues = {
    [AdminField.username]: "",
    [AdminField.password]: "",
    [AdminField.userID]: "10",
    [AdminField.first_name]: "",
    [AdminField.last_name]: "",
    [AdminField.zone]: "",
    [AdminField.type]: workerOptions[1].value,
    [AdminField.status]: "Active",
    [AdminField.phone_number]: "",
};

export type TFormValues = typeof initialValues;

export const validationSchema = () =>
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
            .required()
            .min(8),
        [AdminField.zone]: Yup.string().label(fieldLabels[AdminField.zone]).required(),
        [AdminField.phone_number]: Yup.string()
            .matches(Validation.phoneRegExp, "Phone number is not valid")
            .label(fieldLabels[AdminField.phone_number])
            .max(50)
            .required(),
        [AdminField.type]: Yup.string().label(fieldLabels[AdminField.type]).required(),
        [AdminField.status]: Yup.string().label(fieldLabels[AdminField.status]).required(),
    });
