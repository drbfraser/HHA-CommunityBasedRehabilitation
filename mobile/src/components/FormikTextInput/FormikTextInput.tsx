import { FormikProps } from "formik";
import React, { forwardRef, memo } from "react";
import { TextInput as NativeTextInput, TextInputProps as NativeTextInputProps } from "react-native";
import { HelperText, TextInput } from "react-native-paper";
import { shouldShowError } from "../../util/formikUtil";
import { TextInputProps } from "react-native-paper/lib/typescript/components/TextInput/TextInput";

export type FormikTextInputProps<Field extends string> = Omit<TextInputProps, "theme"> & {
    fieldLabels: Record<Field, string>;
    field: Field;
    formikProps: FormikProps<any>;
};

const BaseFormikTextInput = forwardRef<NativeTextInput, FormikTextInputProps<string>>(
    (props, ref) => {
        const { fieldLabels, field, formikProps, ...other } = props;
        const isError = shouldShowError(formikProps, field);
        return (
            <>
                <TextInput
                    ref={ref}
                    error={isError}
                    label={props.fieldLabels[field]}
                    value={formikProps.values[field]}
                    onChangeText={formikProps.handleChange(field)}
                    onEndEditing={() => formikProps.setFieldTouched(field)}
                    disabled={formikProps.isSubmitting}
                    mode="outlined"
                    blurOnSubmit={false}
                    {...other}
                />
                {isError ? <HelperText type="error">{formikProps.errors[field]}</HelperText> : null}
            </>
        );
    }
);

const areFormikTextInputPropsEqual = (
    oldProps: FormikTextInputProps<string>,
    newProps: FormikTextInputProps<string>
): boolean => {
    if (oldProps.field !== newProps.field) {
        return false;
    }

    const field = oldProps.field;
    return (
        oldProps.editable === newProps.editable &&
        oldProps.key === newProps.key &&
        oldProps.focusable === newProps.focusable &&
        oldProps.disabled === newProps.disabled &&
        oldProps.fieldLabels[field] === newProps.fieldLabels[field] &&
        oldProps.formikProps.values[field] === newProps.formikProps.values[field] &&
        shouldShowError(oldProps.formikProps, field) ===
            shouldShowError(newProps.formikProps, field) &&
        oldProps.formikProps.errors[field] === newProps.formikProps.errors[field] &&
        oldProps.formikProps.isSubmitting === newProps.formikProps.isSubmitting
    );
};

const FormikTextInput = memo(BaseFormikTextInput, areFormikTextInputPropsEqual);

export default FormikTextInput;
