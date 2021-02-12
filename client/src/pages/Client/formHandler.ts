import { FormikHelpers } from "formik";
import { TFormValues } from "./formFields";

export const handleSubmit = (values: TFormValues, helpers: FormikHelpers<TFormValues>) => {
    // here is where you would submit the values to the server
    setTimeout(() => {
        console.log(values);
        helpers.setSubmitting(false);
    }, 1000);
};

export const handleReset = (resetForm: () => void) => {
    if (window.confirm("Are you sure you want to clear the form?")) {
        resetForm();
    }
};
