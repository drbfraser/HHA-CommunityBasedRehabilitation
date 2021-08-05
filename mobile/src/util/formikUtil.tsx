import { FormikProps } from "formik";
import React from "react";
import { HelperText } from "react-native-paper";

export const shouldShowError = (formikProps: FormikProps<any>, field: string): boolean =>
    formikProps.errors[field] !== undefined && formikProps.touched[field] !== undefined;

export const FieldError = (props: { formikProps: FormikProps<any>; field: string }) => (
    <>
        {shouldShowError(props.formikProps, props.field) ? (
            <HelperText type="error">{props.formikProps.errors[props.field]}</HelperText>
        ) : null}
    </>
);
