import { FormikHelpers } from "formik";
import history from "util/history";
import { TVisitFormValues } from "@cbr/common/forms/newVisit/visitFormFields";
import { handleSubmitVisitForm } from "@cbr/common/forms/newVisit/visitFormHandler";

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
        setSubmissionError(true);
    }
};
