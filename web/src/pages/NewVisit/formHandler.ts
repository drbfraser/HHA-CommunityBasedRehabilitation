import { FormikHelpers } from "formik";
import history from "util/history";
import { visitFieldLabels, TVisitFormValues } from "@cbr/common/forms/newVisit/visitFormFields";
import { handleSubmitVisitForm } from "@cbr/common/forms/newVisit/visitFormHandler";
import React from "react";
import { APIFetchFailError } from "@cbr/common/util/endpoints";

export const handleSubmit = async (
    values: TVisitFormValues,
    helpers: FormikHelpers<TVisitFormValues>,
    setSubmissionError: React.Dispatch<React.SetStateAction<string | undefined>>
) => {
    try {
        handleSubmitVisitForm(values);
        history.goBack();
    } catch (e) {
        helpers.setSubmitting(false);
        setSubmissionError(
            e instanceof APIFetchFailError ? e.buildFormError(visitFieldLabels) : `${e}`
        );
    }
};
