import { FormikHelpers } from "formik";
import history from "util/history";
import { BaseFormValues } from "@cbr/common/forms/BaseSurvey/baseSurveyFields";
import { baseSurveyHandleSubmitForm } from "@cbr/common/forms/BaseSurvey/baseSurveyHandler";

export const handleSubmit = async (
    values: BaseFormValues,
    helpers: FormikHelpers<BaseFormValues>,
    setSubmissionError: React.Dispatch<React.SetStateAction<boolean>>
) => {
    try {
        await baseSurveyHandleSubmitForm(values, helpers, setSubmissionError);
        history.goBack();
    } catch (e) {
        helpers.setSubmitting(false);
        setSubmissionError(true);
    }
};
