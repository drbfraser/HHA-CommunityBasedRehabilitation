import { ReferralFormValues, referralHandleSubmit } from "@cbr/common";
import { FormikHelpers } from "formik";

export const handleSubmit = async (
    values: ReferralFormValues,
    helpers: FormikHelpers<ReferralFormValues>,
    setSubmissionError: React.Dispatch<React.SetStateAction<boolean>>
) => {
    try {
        referralHandleSubmit(values, helpers, setSubmissionError);
        // TODO: navigation to client page
    } catch (e) {
        helpers.setSubmitting(false);
        setSubmissionError(true);
    }
};
