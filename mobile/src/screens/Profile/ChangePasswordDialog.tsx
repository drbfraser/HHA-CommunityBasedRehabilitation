import { Button, Dialog, HelperText, TextInput } from "react-native-paper";
import React, { useEffect, useRef, useState } from "react";
import { Formik, FormikProps } from "formik";
import { TextInput as NativeTextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
    ChangePasswordField,
    changePasswordInitialValues,
    fieldLabels,
    passwordValidationSchema,
    TPasswordValues,
    handleSubmitChangePassword,
} from "@cbr/common";
import Alert from "../../components/Alert/Alert";
import { useStyles } from "./ChangePasswordDialog.styles";
import PasswordTextInput from "../../components/PasswordTextInput/PasswordTextInput";
import { getErrorMessageFromSubmissionError } from "@cbr/common";

export type Props = {
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

const shouldShowError = (formikProps: FormikProps<TPasswordValues>, field: ChangePasswordField) =>
    !!formikProps.errors[field] && formikProps.touched[field];

const ChangePasswordDialog = ({ onDismiss, visible }: Props) => {
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const newPassRef = useRef<NativeTextInput>(null);
    const confirmNewPassRef = useRef<NativeTextInput>(null);

    const styles = useStyles();

    useEffect(() => {
        setSubmissionError(null);
    }, [visible]);

    // Pass dismissable={false} to prevent the user from tapping on the outside to dismiss.
    return (
        <Dialog
            dismissable={false}
            visible={visible}
            onDismiss={() => {
                onDismiss(false);
            }}
        >
            <Formik
                initialValues={changePasswordInitialValues}
                validationSchema={passwordValidationSchema}
                onReset={() => setSubmissionError(null)}
                onSubmit={async (values, formikHelpers) => {
                    return handleSubmitChangePassword(values, formikHelpers)
                        .then(() => {
                            setSubmissionError(null);
                            onDismiss(true);
                            formikHelpers.resetForm();
                        })
                        .catch((e: any) => {
                            setSubmissionError(getErrorMessageFromSubmissionError(e));
                        });
                }}
            >
                {(formikProps: FormikProps<TPasswordValues>) => (
                    <>
                        <Dialog.Title>Change password</Dialog.Title>
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
                                <PasswordTextInput
                                    style={styles.passwordTextInput}
                                    label={fieldLabels[ChangePasswordField.oldPassword]}
                                    value={formikProps.values.oldPassword}
                                    onChangeText={formikProps.handleChange(
                                        ChangePasswordField.oldPassword
                                    )}
                                    onEndEditing={() => {
                                        formikProps.setFieldTouched(
                                            ChangePasswordField.oldPassword
                                        );
                                    }}
                                    disabled={formikProps.isSubmitting}
                                    mode="outlined"
                                    blurOnSubmit={false}
                                    onSubmitEditing={() => newPassRef.current?.focus()}
                                />
                                {shouldShowError(formikProps, ChangePasswordField.oldPassword) ? (
                                    <HelperText type="error">
                                        {formikProps.errors.oldPassword}
                                    </HelperText>
                                ) : null}
                                <PasswordTextInput
                                    style={styles.passwordTextInput}
                                    ref={newPassRef}
                                    label={fieldLabels[ChangePasswordField.newPassword]}
                                    value={formikProps.values.newPassword}
                                    onChangeText={formikProps.handleChange(
                                        ChangePasswordField.newPassword
                                    )}
                                    onEndEditing={() => {
                                        formikProps.setFieldTouched(
                                            ChangePasswordField.newPassword
                                        );
                                    }}
                                    disabled={formikProps.isSubmitting}
                                    mode="outlined"
                                    blurOnSubmit={false}
                                    onSubmitEditing={() => confirmNewPassRef.current?.focus()}
                                />
                                {shouldShowError(formikProps, ChangePasswordField.newPassword) ? (
                                    <HelperText type="error">
                                        {formikProps.errors.newPassword}
                                    </HelperText>
                                ) : null}
                                <PasswordTextInput
                                    style={styles.passwordTextInput}
                                    ref={confirmNewPassRef}
                                    label={fieldLabels[ChangePasswordField.confirmNewPassword]}
                                    value={formikProps.values.confirmNewPassword}
                                    onChangeText={formikProps.handleChange(
                                        ChangePasswordField.confirmNewPassword
                                    )}
                                    onEndEditing={() => {
                                        formikProps.setFieldTouched(
                                            ChangePasswordField.confirmNewPassword
                                        );
                                    }}
                                    disabled={formikProps.isSubmitting}
                                    mode="outlined"
                                    blurOnSubmit={false}
                                    onSubmitEditing={() => {
                                        formikProps.handleSubmit();
                                    }}
                                />
                                {shouldShowError(
                                    formikProps,
                                    ChangePasswordField.confirmNewPassword
                                ) ? (
                                    <HelperText type="error">
                                        {formikProps.errors.confirmNewPassword}
                                    </HelperText>
                                ) : null}
                            </KeyboardAwareScrollView>
                        </Dialog.ScrollArea>
                        <Dialog.Actions>
                            <Button
                                disabled={formikProps.isSubmitting}
                                onPress={() => onDismiss(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                disabled={
                                    formikProps.isSubmitting ||
                                    Object.keys(formikProps.errors).length !== 0 ||
                                    Object.keys(formikProps.touched).length === 0
                                }
                                loading={formikProps.isSubmitting}
                                onPress={formikProps.handleSubmit}
                            >
                                Save
                            </Button>
                        </Dialog.Actions>
                    </>
                )}
            </Formik>
        </Dialog>
    );
};

export default ChangePasswordDialog;
