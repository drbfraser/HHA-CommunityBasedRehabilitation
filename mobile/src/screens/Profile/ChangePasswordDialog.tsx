import { Button, Dialog, HelperText, TextInput } from "react-native-paper";
import React, { useEffect, useRef, useState } from "react";
import { Formik, FormikProps } from "formik";
import { TextInput as NativeTextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
    changePasswordField,
    changePasswordInitialValues,
    fieldLabels,
    passwordValidationSchema,
    TPasswordValues,
    handleSubmitChangePassword,
} from "@cbr/common";
import Alert from "../../components/Alert/Alert";
import { useStyles } from "./ChangePasswordDialog.styles";
import { APIFetchFailError } from "@cbr/common";
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
            <Dialog.Title>Change password</Dialog.Title>
            <Dialog.ScrollArea>
                <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
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
                                {!formikProps.isSubmitting && submissionError ? (
                                    <Alert
                                        style={styles.alert}
                                        severity="error"
                                        text={submissionError}
                                    />
                                ) : (
                                    <></>
                                )}
                                <TextInput
                                    label={fieldLabels[changePasswordField.oldPassword]}
                                    value={formikProps.values.oldPassword}
                                    onChangeText={formikProps.handleChange(
                                        changePasswordField.oldPassword
                                    )}
                                    onEndEditing={() => {
                                        formikProps.setFieldTouched(
                                            changePasswordField.oldPassword
                                        );
                                    }}
                                    disabled={formikProps.isSubmitting}
                                    mode="outlined"
                                    secureTextEntry
                                    blurOnSubmit={false}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    autoCompleteType="password"
                                    textContentType="password"
                                    onSubmitEditing={() => newPassRef.current?.focus()}
                                />
                                {!!formikProps.errors.oldPassword &&
                                formikProps.touched.oldPassword === true ? (
                                    <HelperText type="error">
                                        {formikProps.errors.oldPassword}
                                    </HelperText>
                                ) : (
                                    <></>
                                )}
                                <TextInput
                                    ref={newPassRef}
                                    label={fieldLabels[changePasswordField.newPassword]}
                                    value={formikProps.values.newPassword}
                                    onChangeText={formikProps.handleChange(
                                        changePasswordField.newPassword
                                    )}
                                    onEndEditing={() => {
                                        formikProps.setFieldTouched(
                                            changePasswordField.newPassword
                                        );
                                    }}
                                    disabled={formikProps.isSubmitting}
                                    mode="outlined"
                                    secureTextEntry
                                    blurOnSubmit={false}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    autoCompleteType="password"
                                    textContentType="password"
                                    onSubmitEditing={() => confirmNewPassRef.current?.focus()}
                                />
                                {!!formikProps.errors.newPassword &&
                                formikProps.touched.newPassword === true ? (
                                    <HelperText type="error">
                                        {formikProps.errors.newPassword}
                                    </HelperText>
                                ) : (
                                    <></>
                                )}
                                <TextInput
                                    ref={confirmNewPassRef}
                                    label={fieldLabels[changePasswordField.confirmNewPassword]}
                                    value={formikProps.values.confirmNewPassword}
                                    onChangeText={formikProps.handleChange(
                                        changePasswordField.confirmNewPassword
                                    )}
                                    onEndEditing={() => {
                                        formikProps.setFieldTouched(
                                            changePasswordField.confirmNewPassword
                                        );
                                    }}
                                    disabled={formikProps.isSubmitting}
                                    mode="outlined"
                                    secureTextEntry
                                    blurOnSubmit={false}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    autoCompleteType="password"
                                    textContentType="password"
                                    onSubmitEditing={() => {
                                        formikProps.handleSubmit();
                                    }}
                                />
                                {!!formikProps.errors.confirmNewPassword &&
                                formikProps.touched.confirmNewPassword === true ? (
                                    <HelperText type="error">
                                        {formikProps.errors.confirmNewPassword}
                                    </HelperText>
                                ) : (
                                    <></>
                                )}
                                <View style={styles.buttonContainer}>
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
                                        Change
                                    </Button>
                                </View>
                            </>
                        )}
                    </Formik>
                </KeyboardAwareScrollView>
            </Dialog.ScrollArea>
        </Dialog>
    );
};

export default ChangePasswordDialog;
