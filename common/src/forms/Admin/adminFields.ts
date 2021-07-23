import * as Yup from "yup";
import { Validation } from "../../util/validations";
import { UserRole } from "../../util/users";

export interface IRouteParams {
    userId: string;
}

export enum AdminField {
    username = "username",
    password = "password",
    confirmPassword = "confirmPassword",
    first_name = "first_name",
    last_name = "last_name",
    role = "role",
    zone = "zone",
    phone_number = "phone_number",
    is_active = "is_active",
}

export const adminUserFieldLabels = {
    [AdminField.username]: "Username",
    [AdminField.password]: "Enter password",
    [AdminField.confirmPassword]: "Confirm password",
    [AdminField.first_name]: "First name",
    [AdminField.last_name]: "Last name",
    [AdminField.role]: "Role",
    [AdminField.zone]: "Zone",
    [AdminField.phone_number]: "Phone number",
    [AdminField.is_active]: "Status",
};

export const adminUserInitialValues = {
    [AdminField.username]: "",
    [AdminField.password]: "",
    [AdminField.confirmPassword]: "",
    [AdminField.first_name]: "",
    [AdminField.last_name]: "",
    [AdminField.role]: UserRole.WORKER,
    [AdminField.zone]: "",
    [AdminField.phone_number]: "",
    [AdminField.is_active]: true,
};

export const adminPasswordInitialValues = {
    [AdminField.password]: "",
    [AdminField.confirmPassword]: "",
};

export type TNewUserValues = typeof adminUserInitialValues;
export type TAdminPasswordValues = typeof adminPasswordInitialValues;

const infoValidationShape = {
    [AdminField.first_name]: Yup.string()
        .label(adminUserFieldLabels[AdminField.first_name])
        .required()
        .max(50),
    [AdminField.last_name]: Yup.string()
        .label(adminUserFieldLabels[AdminField.last_name])
        .required()
        .max(50),
    [AdminField.username]: Yup.string()
        .label(adminUserFieldLabels[AdminField.username])
        .required()
        .max(50),
    [AdminField.zone]: Yup.string().label(adminUserFieldLabels[AdminField.zone]).required(),
    [AdminField.phone_number]: Yup.string()
        .matches(Validation.phoneRegExp, "Phone number is not valid")
        .label(adminUserFieldLabels[AdminField.phone_number])
        .max(50)
        .required(),
    [AdminField.role]: Yup.string().label(adminUserFieldLabels[AdminField.role]).required(),
    [AdminField.is_active]: Yup.boolean()
        .label(adminUserFieldLabels[AdminField.is_active])
        .required(),
};

//Referencing Daniel's answer https://stackoverflow.com/questions/55451304/formik-yup-password-strength-validation-with-react
const passwordValidationShape = {
    [AdminField.password]: Yup.string()
        .label(adminUserFieldLabels[AdminField.password])
        .matches(Validation.passwordRegExp, Validation.passwordInvalidMsg)
        .required(),
    [AdminField.confirmPassword]: Yup.string()
        .label(adminUserFieldLabels[AdminField.confirmPassword])
        .required()
        .oneOf([Yup.ref(AdminField.password)], "Passwords must match"),
};

export const newUserValidationSchema = Yup.object().shape({
    ...infoValidationShape,
    ...passwordValidationShape,
});
export const editUserValidationSchema = Yup.object().shape(infoValidationShape);
export const adminEditPasswordValidationSchema = Yup.object().shape(passwordValidationShape);
