import { FormikHelpers } from "formik";
import { BaseFormValues } from "@cbr/common/src/forms/BaseSurvey/baseSurveyFields";
import { baseSurveyHandleSubmitForm } from "@cbr/common/src/forms/BaseSurvey/baseSurveyHandler";
import React from "react";

export const handleSubmit = async (
    values: BaseFormValues,
    helpers: FormikHelpers<BaseFormValues>,
    setSubmissionError: React.Dispatch<React.SetStateAction<boolean>>
) => {
    helpers.setSubmitting(true);
    return baseSurveyHandleSubmitForm(values, helpers, setSubmissionError);
};
