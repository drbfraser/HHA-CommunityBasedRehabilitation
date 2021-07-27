import { FormikHelpers } from "formik";
import { TVisitFormValues } from "@cbr/common/src/forms/newVisit/visitFormFields";
import { handleSubmitVisitForm } from "@cbr/common/src/forms/newVisit/visitFormHandler";

export const handleSubmit = async (
    values: TVisitFormValues,
    helpers: FormikHelpers<TVisitFormValues>,
    setSubmissionError: React.Dispatch<React.SetStateAction<boolean>>
) => {
    try {
        handleSubmitVisitForm(values, helpers, setSubmissionError);
    } catch (e) {
        helpers.setSubmitting(false);
        setSubmissionError(true);
    }
};
