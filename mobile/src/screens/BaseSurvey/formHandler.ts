import { FormikHelpers } from "formik";
import { TFormValues } from "@cbr/common/src/Form/baseline/formFields";
import { handleSubmitForm } from "@cbr/common/src/Form/baseline/formHandler";

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
