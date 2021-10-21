import { FormikHelpers } from "formik";
import history from "@cbr/common/util/history";
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
        await handleSubmitVisitForm(values);
        history.goBack();
    } catch (e) {
        helpers.setSubmitting(false);
        setSubmissionError(
            e instanceof APIFetchFailError ? e.buildFormError(visitFieldLabels) : `${e}`
        );
    }
};
