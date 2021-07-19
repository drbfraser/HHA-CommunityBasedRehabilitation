import { Button, Dialog, HelperText } from "react-native-paper";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { Formik, FormikProps } from "formik";
import {
    ReturnKeyTypeOptions,
    StyleProp,
    TextInput as NativeTextInput,
    TextStyle,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
    changePassValidationSchema,
    ChangePasswordField,
    changePasswordFieldLabels,
    changePasswordInitialValues,
    getPassChangeErrorMessageFromSubmissionError,
    handleSubmitChangePassword,
    TPasswordValues,
} from "@cbr/common";
import Alert from "../../components/Alert/Alert";
import { useStyles } from "./ChangePasswordDialog.styles";
import PasswordTextInput from "../../components/PasswordTextInput/PasswordTextInput";

const shouldShowError = (formikProps: FormikProps<TPasswordValues>, field: ChangePasswordField) =>
    !!formikProps.errors[field] && formikProps.touched[field];

interface FormikPasswordTextInputProps {
    field: ChangePasswordField;
    textInputStyle: StyleProp<TextStyle>;
    formikProps: FormikProps<TPasswordValues>;
    returnKeyType: ReturnKeyTypeOptions;
    onSubmitEnding: () => void;
}

const FormikPasswordTextInput = forwardRef<NativeTextInput, FormikPasswordTextInputProps>(
    (props, ref) => {
        const { field, textInputStyle, formikProps, returnKeyType, onSubmitEnding } = props;
        const isError = shouldShowError(formikProps, field);
        return (
            <>
                <PasswordTextInput
                    style={textInputStyle}
                    ref={ref}
                    error={isError}
                    label={changePasswordFieldLabels[field]}
                    value={formikProps.values[field]}
                    onChangeText={formikProps.handleChange(field)}
                    onEndEditing={() => formikProps.setFieldTouched(field)}
                    disabled={formikProps.isSubmitting}
                    returnKeyType={returnKeyType}
                    mode="outlined"
                    blurOnSubmit={false}
                    onSubmitEditing={onSubmitEnding}
                />
                {isError ? <HelperText type="error">{formikProps.errors[field]}</HelperText> : null}
            </>
        );
    }
);

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
        <Dialog dismissable={false} visible={visible} onDismiss={() => onDismiss(false)}>
            <Formik
                initialValues={changePasswordInitialValues}
                validationSchema={changePassValidationSchema}
                onReset={() => setSubmissionError(null)}
                onSubmit={async (values, formikHelpers) => {
                    return handleSubmitChangePassword(values, formikHelpers)
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

                                <FormikPasswordTextInput
                                    field={ChangePasswordField.oldPassword}
                                    textInputStyle={styles.passwordTextInput}
                                    formikProps={formikProps}
                                    returnKeyType="next"
                                    onSubmitEnding={() => newPassRef.current?.focus()}
                                />

                                <FormikPasswordTextInput
                                    field={ChangePasswordField.newPassword}
                                    textInputStyle={styles.passwordTextInput}
                                    formikProps={formikProps}
                                    ref={newPassRef}
                                    returnKeyType="next"
                                    onSubmitEnding={() => confirmNewPassRef.current?.focus()}
                                />

                                <FormikPasswordTextInput
                                    field={ChangePasswordField.confirmNewPassword}
                                    textInputStyle={styles.passwordTextInput}
                                    formikProps={formikProps}
                                    ref={confirmNewPassRef}
                                    returnKeyType="done"
                                    onSubmitEnding={formikProps.handleSubmit}
                                />
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
