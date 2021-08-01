import { FormikHelpers } from "formik";
import { BaseFormValues } from "@cbr/common/src/forms/BaseSurvey/baseSurveyFields";
import { baseSurveyHandleSubmitForm } from "@cbr/common/src/forms/BaseSurvey/baseSurveyHandler";

export const handleSubmit = async (
    values: BaseFormValues,
    helpers: FormikHelpers<BaseFormValues>
) => {
    helpers.setSubmitting(true);
    return baseSurveyHandleSubmitForm(values);
};
