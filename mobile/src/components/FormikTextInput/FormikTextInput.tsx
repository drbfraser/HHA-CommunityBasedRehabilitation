import { FormikProps } from "formik";
import React, { forwardRef } from "react";
import { TextInput as NativeTextInput } from "react-native";
import { HelperText, TextInput } from "react-native-paper";
import { shouldShowError } from "../../util/formikUtil";
import { TextInputProps } from "react-native-paper/lib/typescript/components/TextInput/TextInput";

export type FormikTextInputProps<Field extends string> = Omit<TextInputProps, "theme"> & {
    fieldLabels: {
        // @ts-ignore
        [fieldId: Field]: string;
    };
    field: Field;
    formikProps: FormikProps<any>;
};

const FormikTextInput = forwardRef<NativeTextInput, FormikTextInputProps<string>>((props, ref) => {
    const { fieldLabels, field, formikProps, ...other } = props;
    const isError = shouldShowError(formikProps, field);
    return (
        <>
            <TextInput
                {...other}
                ref={ref}
                error={isError}
                label={props.fieldLabels[field]}
                value={formikProps.values[field]}
                onChangeText={formikProps.handleChange(field)}
                onEndEditing={() => formikProps.setFieldTouched(field)}
                disabled={formikProps.isSubmitting}
                mode="outlined"
                blurOnSubmit={false}
            />
            {isError ? <HelperText type="error">{formikProps.errors[field]}</HelperText> : null}
        </>
    );
});

export default FormikTextInput;
