import { Button, Dialog } from "react-native-paper";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Formik, FormikProps } from "formik";
import { TextInput as NativeTextInput } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
    adminEditPasswordValidationSchema,
    AdminField,
    adminPasswordInitialValues,
    adminUserFieldLabels,
    changePassValidationSchema,
    ChangePasswordField,
    changePasswordFieldLabels,
    changePasswordInitialValues,
    countObjectKeys,
    getPassChangeErrorMessageFromSubmissionError,
    handleSubmitChangePassword,
    IUser,
    TAdminPasswordValues,
    TPasswordValues,
} from "@cbr/common";
import Alert from "../Alert/Alert";
import { useStyles } from "./ChangePasswordDialog.styles";
import FormikTextInput from "../FormikTextInput/FormikTextInput";
import passwordTextInputProps from "../PasswordTextInput/passwordTextInputProps";
import {
    handleSelfChangePassword,
    handleUpdatePassword,
} from "../../screens/Admin/AdminFormHandler";
import { dbType } from "../../util/watermelonDatabase";
import { SyncContext } from "../../context/SyncContext/SyncContext";
import { useTranslation } from "react-i18next";

export type Props = {
    isSelf: boolean;
    user: IUser;
    database: dbType;
    /**
     * Callback that is called when the dialog is dismissed (user cancels or password successfully
     * changed). The {@link visible} prop needs to be updated when this is called.
     *
     * @param isSubmitSuccess Whether the user's password was changed successfully.
     */
    onDismiss: (isSubmitSuccess: boolean) => void;
    /** Determines whether the dialog is visible. */
    visible: boolean;
};

const ChangePasswordDialog = ({ isSelf, user, database, onDismiss, visible }: Props) => {
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const newPassRef = useRef<NativeTextInput>(null);
    const confirmNewPassRef = useRef<NativeTextInput>(null);
    const styles = useStyles();
    const { autoSync, cellularSync } = useContext(SyncContext);
    const { t } = useTranslation();

    useEffect(() => {
        setSubmissionError(null);
    }, [visible]);

    // Pass dismissable={false} to prevent the user from tapping on the outside to dismiss.
    return (
        <Dialog dismissable={false} visible={visible} onDismiss={() => onDismiss(false)}>
            {isSelf ? (
                <Formik
                    initialValues={changePasswordInitialValues}
                    validationSchema={changePassValidationSchema}
                    onReset={() => setSubmissionError(null)}
                    onSubmit={async (values, formikHelpers) => {
                        return handleSelfChangePassword(
                            user.id,
                            values,
                            database,
                            formikHelpers,
                            autoSync,
                            cellularSync
                        )
                            .then(() => {
                                setSubmissionError(null);
                                onDismiss(true);
                                formikHelpers.resetForm();
                            })
                            .catch((e: any) => {
                                setSubmissionError(getPassChangeErrorMessageFromSubmissionError(e));
                            });
                    }}
                >
                    {(formikProps: FormikProps<TPasswordValues>) => (
                        <>
                            <Dialog.Title>{t("login.changePassword")}</Dialog.Title>
                            <Dialog.ScrollArea>
                                <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
                                    {!formikProps.isSubmitting && submissionError ? (
                                        <Alert
                                            style={styles.alert}
                                            severity="error"
                                            text={submissionError}
                                            onClose={() => setSubmissionError(null)}
                                        />
                                    ) : null}

                                    <FormikTextInput
                                        {...passwordTextInputProps}
                                        fieldLabels={changePasswordFieldLabels}
                                        field={ChangePasswordField.oldPassword}
                                        style={styles.passwordTextInput}
                                        formikProps={formikProps}
                                        returnKeyType="next"
                                        onSubmitEditing={() => newPassRef.current?.focus()}
                                    />

                                    <FormikTextInput
                                        {...passwordTextInputProps}
                                        fieldLabels={changePasswordFieldLabels}
                                        field={ChangePasswordField.newPassword}
                                        style={styles.passwordTextInput}
                                        formikProps={formikProps}
                                        ref={newPassRef}
                                        returnKeyType="next"
                                        onSubmitEditing={() => confirmNewPassRef.current?.focus()}
                                    />

                                    <FormikTextInput
                                        {...passwordTextInputProps}
                                        fieldLabels={changePasswordFieldLabels}
                                        field={ChangePasswordField.confirmNewPassword}
                                        style={styles.passwordTextInput}
                                        formikProps={formikProps}
                                        ref={confirmNewPassRef}
                                        returnKeyType="done"
                                        onSubmitEditing={() => formikProps.handleSubmit}
                                    />
                                </KeyboardAwareScrollView>
                            </Dialog.ScrollArea>
                            <Dialog.Actions>
                                <Button
                                    disabled={formikProps.isSubmitting}
                                    onPress={() => onDismiss(false)}
                                >
                                    {t("general.cancel")}
                                </Button>
                                <Button
                                    disabled={
                                        formikProps.isSubmitting ||
                                        countObjectKeys(formikProps.errors) !== 0 ||
                                        countObjectKeys(formikProps.touched) === 0
                                    }
                                    loading={formikProps.isSubmitting}
                                    onPress={formikProps.handleSubmit}
                                >
                                    {t("general.save")}
                                </Button>
                            </Dialog.Actions>
                        </>
                    )}
                </Formik>
            ) : (
                <Formik
                    initialValues={adminPasswordInitialValues}
                    validationSchema={adminEditPasswordValidationSchema}
                    onReset={() => setSubmissionError(null)}
                    onSubmit={async (values, formikHelpers) => {
                        return handleUpdatePassword(
                            user.id,
                            values,
                            database,
                            formikHelpers,
                            autoSync,
                            cellularSync
                        )
                            .then(() => {
                                setSubmissionError(null);
                                onDismiss(true);
                                formikHelpers.resetForm();
                            })
                            .catch((e: any) => setSubmissionError(`${e}`));
                    }}
                >
                    {(formikProps: FormikProps<TAdminPasswordValues>) => (
                        <>
                            <Dialog.Title>
                                {t("login.changePasswordFor", {
                                    username: user.username,
                                    userID: user.id,
                                })}
                            </Dialog.Title>
                            <Dialog.ScrollArea>
                                <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
                                    {!formikProps.isSubmitting && submissionError ? (
                                        <Alert
                                            style={styles.alert}
                                            severity="error"
                                            text={submissionError}
                                            onClose={() => setSubmissionError(null)}
                                        />
                                    ) : null}

                                    <FormikTextInput
                                        {...passwordTextInputProps}
                                        fieldLabels={adminUserFieldLabels}
                                        field={AdminField.password}
                                        style={styles.passwordTextInput}
                                        formikProps={formikProps}
                                        ref={newPassRef}
                                        returnKeyType="next"
                                        onSubmitEditing={() => confirmNewPassRef.current?.focus()}
                                    />

                                    <FormikTextInput
                                        {...passwordTextInputProps}
                                        fieldLabels={adminUserFieldLabels}
                                        field={AdminField.confirmPassword}
                                        style={styles.passwordTextInput}
                                        formikProps={formikProps}
                                        ref={confirmNewPassRef}
                                        returnKeyType="done"
                                        onSubmitEditing={() => formikProps.handleSubmit}
                                    />
                                </KeyboardAwareScrollView>
                            </Dialog.ScrollArea>
                            <Dialog.Actions>
                                <Button
                                    disabled={formikProps.isSubmitting}
                                    onPress={() => onDismiss(false)}
                                >
                                    {t("general.cancel")}
                                </Button>
                                <Button
                                    disabled={
                                        formikProps.isSubmitting ||
                                        countObjectKeys(formikProps.errors) !== 0 ||
                                        countObjectKeys(formikProps.touched) === 0
                                    }
                                    loading={formikProps.isSubmitting}
                                    onPress={formikProps.handleSubmit}
                                >
                                    {t("general.save")}
                                </Button>
                            </Dialog.Actions>
                        </>
                    )}
                </Formik>
            )}
        </Dialog>
    );
};

export default ChangePasswordDialog;
