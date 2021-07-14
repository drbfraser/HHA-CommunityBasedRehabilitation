import { FormikHelpers } from "formik";
import { BaseFormValues } from "@cbr/common/src/forms/BaseSurvey/BaseSurveyFormFields";
import { baseSurveyHandleSubmitForm } from "@cbr/common/src/forms/BaseSurvey/baseSurveyFormHandler";

export const handleSubmit = async (
    values: BaseFormValues,
    helpers: FormikHelpers<BaseFormValues>,
    setSubmissionError: React.Dispatch<React.SetStateAction<boolean>>
) => {
    try {
        baseSurveyHandleSubmitForm(values, helpers, setSubmissionError);
        // TODO: navigation to client page
    } catch (e) {
        helpers.setSubmitting(false);
        setSubmissionError(true);
    }
};
