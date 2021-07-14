import { FormikHelpers } from "formik";
import { ReferralFormValues } from "@cbr/common/forms/Referral/referralFields";
import { referralHandleSubmit } from "@cbr/common/forms/Referral/referralHandler";

import history from "../../util/history";

export const handleSubmit = async (
    values: ReferralFormValues,
    helpers: FormikHelpers<ReferralFormValues>,
    setSubmissionError: React.Dispatch<React.SetStateAction<boolean>>
) => {
    try {
        referralHandleSubmit(values, helpers, setSubmissionError);
        history.goBack();
    } catch (e) {
        helpers.setSubmitting(false);
        setSubmissionError(true);
    }
};
