import { FormikProps } from "formik";

export const shouldShowError = (formikProps: FormikProps<any>, field: string): boolean =>
    formikProps.errors[field] !== undefined && formikProps.touched[field] !== undefined;
