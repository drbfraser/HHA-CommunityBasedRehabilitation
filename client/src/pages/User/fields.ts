import * as Yup from "yup";

export enum changePasswordField {
    oldPassword = "oldPassword",
    newPassword = "newPassword",
    confirmNewPassword = "confirmNewPassword",
}

export const fieldLabels = {
    [changePasswordField.oldPassword]: "Old Password",
    [changePasswordField.newPassword]: "New password",
    [changePasswordField.confirmNewPassword]: "Confirm New password",
};

export const changePasswordInitialValues = {
    [changePasswordField.oldPassword]: "",
    [changePasswordField.newPassword]: "",
    [changePasswordField.confirmNewPassword]: "",
};

export type TPasswordValues = typeof changePasswordInitialValues;

export const passwordValidationSchema = () =>
    Yup.object().shape({
        [changePasswordField.oldPassword]: Yup.string()
            .label(fieldLabels[changePasswordField.oldPassword])
            .required(),
        [changePasswordField.newPassword]: Yup.string()
            .label(fieldLabels[changePasswordField.newPassword])
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
                "Your password must be at least 8 characters long and must contain at least: one lowercase letter, one uppercase letter and one number."
            )
            .required(),
        [changePasswordField.confirmNewPassword]: Yup.string()
            .label(fieldLabels[changePasswordField.confirmNewPassword])
            .required()
            .oneOf([Yup.ref(changePasswordField.newPassword)], "Passwords must match"),
    });
