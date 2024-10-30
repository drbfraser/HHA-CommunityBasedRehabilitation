import React from "react";
import { useTranslation } from "react-i18next";
import { Field, FormikProps } from "formik";
import { TextField } from "formik-mui";
import { Box, FormLabel, MenuItem } from "@mui/material";

import { otherServices, Impairments } from "@cbr/common/util/referrals";
import { referralFieldLabels, ReferralFormField } from "@cbr/common/forms/Referral/referralFields";
import { newReferralStyles } from "../NewReferral.styles";

interface IFormProps {
    formikProps: FormikProps<any>;
}

const OtherServicesForm = (props: IFormProps) => {
    const { t } = useTranslation();

    return (
        <div>
            <FormLabel>{t("referral.selectAnotherReferral")}</FormLabel>
            <br />
            <br />
            <Box sx={newReferralStyles.fieldIndent}>
                <Field
                    select
                    required
                    fullWidth
                    component={TextField}
                    name={ReferralFormField.otherDescription}
                    label={referralFieldLabels[ReferralFormField.otherDescription]}
                    variant="outlined"
                >
                    {Object.entries(otherServices).map(([value, name]) => (
                        <MenuItem key={value} value={value}>
                            {name}
                        </MenuItem>
                    ))}
                </Field>
                {props.formikProps.values[ReferralFormField.otherDescription] ===
                    Impairments.OTHER && (
                    <div>
                        <br />
                        <FormLabel>{t("referral.describeReferral")}</FormLabel>
                        <Field
                            required
                            fullWidth
                            component={TextField}
                            name={ReferralFormField.referralOther}
                            label={referralFieldLabels[ReferralFormField.referralOther]}
                            variant="outlined"
                        />
                    </div>
                )}
            </Box>
        </div>
    );
};

export default OtherServicesForm;
