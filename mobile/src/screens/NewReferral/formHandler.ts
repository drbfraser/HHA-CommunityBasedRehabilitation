import { ReferralFormValues, referralHandleSubmit } from "@cbr/common";
import { FormikHelpers } from "formik";

export const handleSubmit = async (
    values: ReferralFormValues,
    helpers: FormikHelpers<ReferralFormValues>,
    setSubmissionError: React.Dispatch<React.SetStateAction<boolean>>
) => {
    return referralHandleSubmit(values, helpers, setSubmissionError);
};
