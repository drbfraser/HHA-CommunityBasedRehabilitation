import { FormikProps } from "formik";
import React from "react";
import { HelperText } from "react-native-paper";

export const shouldShowError = (formikProps: FormikProps<any>, field: string): boolean =>
    formikProps.errors[field] !== undefined &&
    formikProps.touched[field] !== false &&
    formikProps.touched[field] !== undefined;

export type TFormikComponentProps<Field extends string> = {
    fieldLabels: Record<Field, string>;
    field: Field;
    formikProps: FormikProps<any>;
};

export const areFormikComponentPropsEqual = <Field extends string>(
    oldProps: TFormikComponentProps<Field>,
    newProps: TFormikComponentProps<Field>
): boolean => {
    if (oldProps.field !== newProps.field) {
        return false;
    }

    const field = oldProps.field;
    return (
        oldProps.fieldLabels[field] === newProps.fieldLabels[field] &&
        oldProps.formikProps.values[field] === newProps.formikProps.values[field] &&
        shouldShowError(oldProps.formikProps, field) ===
            shouldShowError(newProps.formikProps, field) &&
        oldProps.formikProps.errors[field] === newProps.formikProps.errors[field] &&
        oldProps.formikProps.isSubmitting === newProps.formikProps.isSubmitting
    );
};

export const FieldError = (props: { formikProps: FormikProps<any>; field: string }) => {
    const error = props.formikProps.errors[props.field];
    const isErrorString = typeof error === "string";

    return (
        <>
            {shouldShowError(props.formikProps, props.field) && isErrorString ? (
                <HelperText type="error">{error}</HelperText>
            ) : null}
        </>
    );
};
