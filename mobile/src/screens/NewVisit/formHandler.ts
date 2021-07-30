import { FormikHelpers } from "formik";
import { TVisitFormValues } from "@cbr/common/src/forms/newVisit/visitFormFields";
import { handleSubmitVisitForm } from "@cbr/common/src/forms/newVisit/visitFormHandler";

export const handleSubmit = async (
    values: TVisitFormValues,
    helpers: FormikHelpers<TVisitFormValues>
) => {
    helpers.setSubmitting(false);
    return handleSubmitVisitForm(values);
};
