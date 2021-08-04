import { FormikProps } from "formik";
import React, { forwardRef, memo } from "react";
import { TextInput as NativeTextInput, TextInputProps as NativeTextInputProps } from "react-native";
import { HelperText, TextInput } from "react-native-paper";
import {
    areFormikComponentPropsEqual,
    TFormikComponentProps,
    shouldShowError,
} from "../../util/formikUtil";
import { TextInputProps } from "react-native-paper/lib/typescript/components/TextInput/TextInput";

export type FormikTextInputProps<Field extends string> = Omit<TextInputProps, "theme"> &
    TFormikComponentProps<Field>;

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
    return (
        oldProps.editable === newProps.editable &&
        oldProps.key === newProps.key &&
        oldProps.focusable === newProps.focusable &&
        oldProps.disabled === newProps.disabled &&
        areFormikComponentPropsEqual(oldProps, newProps)
    );
};

const FormikTextInput = memo(BaseFormikTextInput, areFormikTextInputPropsEqual);

export default FormikTextInput;
