import { ReferralFormValues, referralHandleSubmit } from "@cbr/common";
import { FormikHelpers } from "formik";

export const handleSubmit = async (
    values: ReferralFormValues,
    helpers: FormikHelpers<ReferralFormValues>
) => {
    helpers.setSubmitting(true);
    return referralHandleSubmit(values);
};
