import { FormikHelpers } from "formik";
import { referralFieldLabels, ReferralFormValues } from "@cbr/common/forms/Referral/referralFields";
import { referralHandleSubmit } from "@cbr/common/forms/Referral/referralHandler";

import history from "@cbr/common/util/history";
import React from "react";
import { APIFetchFailError } from "@cbr/common/util/endpoints";

export const handleSubmit = async (
    values: ReferralFormValues,
    helpers: FormikHelpers<ReferralFormValues>,
    setSubmissionError: React.Dispatch<React.SetStateAction<string | undefined>>,
) => {
    try {
        const source = "web";
        await referralHandleSubmit(values, source);
        history.goBack();
    } catch (e) {
        helpers.setSubmitting(false);
        setSubmissionError(
            e instanceof APIFetchFailError ? e.buildFormError(referralFieldLabels) : `${e}`,
        );
    }
};
