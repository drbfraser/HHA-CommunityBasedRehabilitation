import * as Yup from "yup";
import { Validation } from "../../util/validations";

export enum ChangePasswordField {
    oldPassword = "oldPassword",
    newPassword = "newPassword",
    confirmNewPassword = "confirmNewPassword",
}

export const changePasswordFieldLabels = {
    [ChangePasswordField.oldPassword]: "Old password",
    [ChangePasswordField.newPassword]: "New password",
    [ChangePasswordField.confirmNewPassword]: "Confirm new password",
};

export const changePasswordInitialValues = {
    [ChangePasswordField.oldPassword]: "",
    [ChangePasswordField.newPassword]: "",
    [ChangePasswordField.confirmNewPassword]: "",
};

export type TPasswordValues = typeof changePasswordInitialValues;

export const changePassValidationSchema = () =>
    Yup.object().shape({
        [ChangePasswordField.oldPassword]: Yup.string()
            .label(changePasswordFieldLabels[ChangePasswordField.oldPassword])
            .required(),
        [ChangePasswordField.newPassword]: Yup.string()
            .label(changePasswordFieldLabels[ChangePasswordField.newPassword])
            .matches(Validation.passwordRegExp, Validation.passwordInvalidMsg)
            .notOneOf([Yup.ref(ChangePasswordField.oldPassword)], "Passwords must be different")
            .required(),
        [ChangePasswordField.confirmNewPassword]: Yup.string()
            .label(changePasswordFieldLabels[ChangePasswordField.confirmNewPassword])
            .oneOf([Yup.ref(ChangePasswordField.newPassword)], "Passwords must match")
            .required(),
    });
