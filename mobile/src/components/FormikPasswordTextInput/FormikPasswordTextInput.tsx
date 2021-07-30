import { FormikProps } from "formik";
import { AdminField, ChangePasswordField } from "@cbr/common/index";
import React, { forwardRef } from "react";
import {
    ReturnKeyTypeOptions,
    StyleProp,
    TextInput as NativeTextInput,
    TextStyle,
} from "react-native";
import PasswordTextInput from "../PasswordTextInput/PasswordTextInput";
import { HelperText } from "react-native-paper";
import { shouldShowError } from "../../util/formikUtil";

export interface FormikPasswordTextInputProps<Field extends string> {
    fieldLabels: Record<Field, string>;
    field: Field;
    textInputStyle?: StyleProp<TextStyle>;
    formikProps: FormikProps<any>;
    returnKeyType: ReturnKeyTypeOptions;
    onSubmitEditing?: () => void;
}

const FormikPasswordTextInput = forwardRef<
    NativeTextInput,
    FormikPasswordTextInputProps<AdminField | ChangePasswordField>
>((props, ref) => {
    const { field, textInputStyle, formikProps, returnKeyType, onSubmitEditing } = props;
    const isError = shouldShowError(formikProps, field);
    return (
        <>
            <PasswordTextInput
                style={textInputStyle}
                ref={ref}
                error={isError}
                label={props.fieldLabels[field]}
                value={formikProps.values[field]}
                onChangeText={formikProps.handleChange(field)}
                onEndEditing={() => formikProps.setFieldTouched(field)}
                disabled={formikProps.isSubmitting}
                returnKeyType={returnKeyType}
                mode="outlined"
                blurOnSubmit={false}
                onSubmitEditing={onSubmitEditing}
            />
            {isError ? <HelperText type="error">{formikProps.errors[field]}</HelperText> : null}
        </>
    );
});

export default FormikPasswordTextInput;
