import { FormikHelpers } from "formik";
import history from "@cbr/common/util/history";
import { baseFieldLabels, BaseFormValues } from "@cbr/common/forms/BaseSurvey/baseSurveyFields";
import { baseSurveyHandleSubmitForm } from "@cbr/common/forms/BaseSurvey/baseSurveyHandler";
import React from "react";
import { APIFetchFailError } from "@cbr/common/util/endpoints";

export const handleSubmit = async (
    values: BaseFormValues,
    helpers: FormikHelpers<BaseFormValues>,
    setSubmissionError: React.Dispatch<React.SetStateAction<string | undefined>>
) => {
    try {
        const source = "web";
        await baseSurveyHandleSubmitForm(values, source);
        history.goBack();
    } catch (e) {
        helpers.setSubmitting(false);
        setSubmissionError(
            e instanceof APIFetchFailError ? e.buildFormError(baseFieldLabels) : `${e}`
        );
    }
};
