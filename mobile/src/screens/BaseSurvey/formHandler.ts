import { FormikHelpers } from "formik";
import { BaseFormValues } from "@cbr/common/src/forms/BaseSurvey/baseSurveyFields";
import { baseSurveyHandleSubmitForm } from "@cbr/common/src/forms/BaseSurvey/baseSurveyHandler";

export const handleSubmit = async (
    values: BaseFormValues,
    helpers: FormikHelpers<BaseFormValues>,
    setSubmissionError: React.Dispatch<React.SetStateAction<boolean>>
) => {
    return baseSurveyHandleSubmitForm(values, helpers, setSubmissionError);
};
