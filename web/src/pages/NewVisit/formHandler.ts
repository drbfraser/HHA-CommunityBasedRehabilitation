import { FormikHelpers } from "formik";
import history from "util/history";
import { visitFieldLabels, TVisitFormValues } from "@cbr/common/forms/newVisit/visitFormFields";
import { handleSubmitVisitForm } from "@cbr/common/forms/newVisit/visitFormHandler";
import { APIFetchFailError } from "@cbr/common/util/endpoints";


export const handleSubmit = async (
    values: TVisitFormValues,
    helpers: FormikHelpers<TVisitFormValues>,
    setSubmissionError: React.Dispatch<React.SetStateAction<boolean>>
) => {
    try {
        handleSubmitVisitForm(values, helpers, setSubmissionError);
        history.goBack();
    } catch (e) {
        helpers.setSubmitting(false);
        setSubmissionError(e instanceof APIFetchFailError ? e.buildFormError(visitFieldLabels) : `${e}`);
    }
};
