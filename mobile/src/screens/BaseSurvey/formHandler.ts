import { FormikHelpers } from "formik";
import { TFormValues } from "@cbr/common";
import { handleSubmitForm } from "@cbr/common";

export const handleSubmit = async (
    values: TFormValues,
    helpers: FormikHelpers<TFormValues>,
    setSubmissionError: React.Dispatch<React.SetStateAction<boolean>>
) => {
    try {
        handleSubmitForm(values, helpers, setSubmissionError);
        // TODO: navigation to client page
    } catch (e) {
        helpers.setSubmitting(false);
        setSubmissionError(true);
    }
};
