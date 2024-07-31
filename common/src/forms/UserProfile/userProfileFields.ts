import * as Yup from "yup";
import { Validation } from "../../util/validations";
import i18n from "i18next";

export enum ChangePasswordField {
    oldPassword = "oldPassword",
    newPassword = "newPassword",
    confirmNewPassword = "confirmNewPassword",
}

export const changePasswordFieldLabels = {
    [ChangePasswordField.oldPassword]: i18n.t("common.userProfile.oldPassword"),
    [ChangePasswordField.newPassword]: i18n.t("common.userProfile.newPassword"),
    [ChangePasswordField.confirmNewPassword]: i18n.t("common.userProfile.confirmNewPassword"),
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
            .notOneOf([Yup.ref(ChangePasswordField.oldPassword)], i18n.t("common.userProfile.passwordsMustBeDifferent"))
            .required(),
        [ChangePasswordField.confirmNewPassword]: Yup.string()
            .label(changePasswordFieldLabels[ChangePasswordField.confirmNewPassword])
            .oneOf([Yup.ref(ChangePasswordField.newPassword)], i18n.t("common.userProfile.passwordsMustMatch"))
            .required(),
    });
