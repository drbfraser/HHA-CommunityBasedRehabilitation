import * as Yup from "yup";
import { Validation } from "util/validations";
import { UserRole } from "util/users";

export interface IRouteParams {
    userId: string;
}

export enum AdminField {
    username = "username",
    password = "password",
    confirm = "confirm",
    first_name = "first_name",
    last_name = "last_name",
    role = "role",
    zone = "zone",
    phone_number = "phone_number",
    is_active = "is_active",
}

export const fieldLabels = {
    [AdminField.username]: "Username",
    [AdminField.password]: "Enter Password",
    [AdminField.confirm]: "Confirm Password",
    [AdminField.first_name]: "First Name",
    [AdminField.last_name]: "Last Name",
    [AdminField.role]: "Role",
    [AdminField.zone]: "Zone",
    [AdminField.phone_number]: "Phone Number",
    [AdminField.is_active]: "Status",
};

export const initialValues = {
    [AdminField.username]: "",
    [AdminField.password]: "",
    [AdminField.confirm]: "",
    [AdminField.first_name]: "",
    [AdminField.last_name]: "",
    [AdminField.role]: UserRole.WORKER,
    [AdminField.zone]: "",
    [AdminField.phone_number]: "",
    [AdminField.is_active]: true,
};

export type TNewUserValues = typeof initialValues;

export const validationSchema = (newUser: boolean) => {
    let yupShape = {
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
        [AdminField.zone]: Yup.string().label(fieldLabels[AdminField.zone]).required(),
        [AdminField.phone_number]: Yup.string()
            .matches(Validation.phoneRegExp, "Phone number is not valid")
            .label(fieldLabels[AdminField.phone_number])
            .max(50)
            .required(),
        [AdminField.role]: Yup.string().label(fieldLabels[AdminField.role]).required(),
        [AdminField.is_active]: Yup.boolean().label(fieldLabels[AdminField.is_active]).required(),
    } as any;

    if (newUser) {
        yupShape = {
            ...yupShape,
            [AdminField.password]: Yup.string()
                .label(fieldLabels[AdminField.password])
                .min(8)
                .required(),
            [AdminField.confirm]: Yup.string()
                .label(fieldLabels[AdminField.confirm])
                .min(8)
                .required(),
        };
    }

    return Yup.object().shape(yupShape);
};

export const validationEditSchema = validationSchema(false);
export const validationNewSchema = validationSchema(true);
