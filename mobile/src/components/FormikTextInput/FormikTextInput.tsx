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
    TFormikComponentProps<Field> & {
        /**
         * Whether to set the field as touched when the text changes.
         *
         * This might not be desirable to set as true for fields that have other validation
         * requirements than just `.required()`, as it can result in errors showing up as soon as
         * the user enters input for the first time (not what web does). This is false by default.
         */
        touchOnChangeText?: boolean;
    };

const BaseFormikTextInput = forwardRef<NativeTextInput, FormikTextInputProps<string>>(
    (props, ref) => {
        const { fieldLabels, field, formikProps, touchOnChangeText, ...other } = props;
        const isError = shouldShowError(formikProps, field);
        return (
            <>
                <TextInput
                    ref={ref}
                    error={isError}
                    label={props.fieldLabels[field]}
                    value={formikProps.values[field]}
                    onChangeText={
                        touchOnChangeText
                            ? (text) => {
                                  formikProps.handleChange(field)(text);
                                  // Delay and then validate as a workaround to
                                  // https://github.com/formium/formik/issues/2457
                                  if (!formikProps.touched[field]) {
                                      setTimeout(() => formikProps.setFieldTouched(field), 150);
                                  }
                              }
                            : formikProps.handleChange(field)
                    }
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
