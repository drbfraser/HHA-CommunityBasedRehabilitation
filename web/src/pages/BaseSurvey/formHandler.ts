import { FormikHelpers } from "formik";
import history from "util/history";
import { TFormValues } from "@cbr/common/forms/baseSurvey/baseSurveyFormFields";
import { handleSubmitForm } from "@cbr/common/forms/baseSurvey/baseSurveyFormHandler";

export const handleSubmit = async (
    values: TFormValues,
    helpers: FormikHelpers<TFormValues>,
    setSubmissionError: React.Dispatch<React.SetStateAction<boolean>>
) => {
    try {
        handleSubmitForm(values, helpers, setSubmissionError);
        history.goBack();
    } catch (e) {
        helpers.setSubmitting(false);
        setSubmissionError(true);
    }
};
