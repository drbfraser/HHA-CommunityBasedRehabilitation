import { FormikHelpers } from "formik";
import { TFormValues } from "./ClientFormFields";

export const handleSubmit = (values: TFormValues, helpers: FormikHelpers<TFormValues>) => {
    // here is where you would submit the values to the server
    setTimeout(() => {
        console.log(values);
        helpers.setSubmitting(false);
    }, 1000);
};
