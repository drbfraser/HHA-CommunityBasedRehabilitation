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
} from "./fields";
import { apiFetch, Endpoint } from "@cbr/common";
import Alert from "../../components/Alert/Alert";

export type Props = {
    /**
     * Callback that is called when the dialog is dismissed (user cancels or password successfully
     * changed).
     *
     * @param isSubmitSuccess Whether the user's password was changed successfully.
     */
    onDismiss: (isSubmitSuccess: boolean) => void;
    /** Determines whether the dialog is visible. */
    visible: boolean;
};

const updateCurrentUserPassword = async (userInfo: string) => {
    const init: RequestInit = {
        method: "PUT",
        body: userInfo,
    };

    const userParams = "";
    return await apiFetch(Endpoint.USER_CURRENT_PASSWORD, userParams, init);
};

const ChangePasswordDialog = ({ onDismiss, visible }: Props) => {
    const [isSubmissionError, setSubmissionError] = useState(false);
    const newPassRef = useRef<NativeTextInput>(null);
    const confirmNewPassRef = useRef<NativeTextInput>(null);

    useEffect(() => {
        if (!visible) {
            setSubmissionError(false);
        }
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
                        onReset={() => setSubmissionError(false)}
                        onSubmit={async (values: TPasswordValues, formikHelpers) => {
                            console.log("Attempting submission");
                            setSubmissionError(false);
                            const passwordInfo = JSON.stringify({
                                current_password: values.oldPassword,
                                new_password: values.newPasswod,
                            });
                            try {
                                await updateCurrentUserPassword(passwordInfo);
                                onDismiss(true);
                            } catch (e) {
                                setSubmissionError(true);
                                formikHelpers.setSubmitting(false);
                            }
                        }}
                    >
                        {(formikProps: FormikProps<TPasswordValues>) => (
                            <>
                                {!formikProps.isSubmitting && isSubmissionError ? (
                                    <Alert
                                        style={{
                                            marginVertical: 0,
                                        }}
                                        severity="error"
                                        text="Failed to change password."
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
                                <View
                                    style={{
                                        marginVertical: 10,
                                        flexDirection: "row",
                                        justifyContent: "flex-en",
                                    }}
                                >
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
