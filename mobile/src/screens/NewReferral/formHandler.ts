import { ReferralFormValues, referralHandleSubmit } from "@cbr/common";
import { FormikHelpers } from "formik";
import React from "react";

export const handleSubmit = async (
    values: ReferralFormValues,
    helpers: FormikHelpers<ReferralFormValues>,
    setSubmissionError: React.Dispatch<React.SetStateAction<boolean>>
) => {
    helpers.setSubmitting(true);
    return referralHandleSubmit(values, helpers, setSubmissionError);
};
