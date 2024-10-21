import React from "react";
import { useTranslation } from "react-i18next";
import { Field, FormikProps } from "formik";
import { TextField } from "formik-mui";
import { Box, FormLabel, MenuItem } from "@mui/material";

import { mentalHealthConditions, MentalConditions } from "@cbr/common/util/referrals";
import { referralFieldLabels, ReferralFormField } from "@cbr/common/forms/Referral/referralFields";
import { newReferralStyles } from "../NewReferral.styles";

interface IFormProps {
    formikProps: FormikProps<any>;
}

const MentalHealthForm = (props: IFormProps) => {
    const { t } = useTranslation();

    return (
        <div>
            <FormLabel>{t("referral.selectMentalHealthReferral")}</FormLabel>
            <br />
            <br />
            {/* todosd: replace with old div? */}
            <Box sx={newReferralStyles.fieldIndent}>
                <Field
                    component={TextField}
                    variant="outlined"
                    name={ReferralFormField.mentalHealthCondition}
                    label={referralFieldLabels[ReferralFormField.mentalHealthCondition]}
                    select
                    fullWidth
                    required
                >
                    {Object.entries(mentalHealthConditions).map(([value, name]) => (
                        <MenuItem key={value} value={value}>
                            {name}
                        </MenuItem>
                    ))}
                </Field>
                {props.formikProps.values[ReferralFormField.mentalHealthCondition] ===
                    MentalConditions.OTHER && (
                    <div>
                        <br />
                        <FormLabel>{t("referral.describeReferral")}</FormLabel>
                        <Field
                            component={TextField}
                            fullWidth
                            label={referralFieldLabels[ReferralFormField.mentalConditionOther]}
                            required
                            name={ReferralFormField.mentalConditionOther}
                            variant="outlined"
                        />
                    </div>
                )}
            </Box>
        </div>
    );
};

export default MentalHealthForm;
