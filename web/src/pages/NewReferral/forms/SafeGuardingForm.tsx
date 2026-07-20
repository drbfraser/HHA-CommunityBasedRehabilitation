import React from "react";
import { useTranslation } from "react-i18next";
import { Field, FormikProps } from "formik";
import { TextField } from "formik-mui";
import { Box, FormLabel, MenuItem } from "@mui/material";

import { safeGuardingActionsNeeded, safeGuardingObservations } from "@cbr/common/util/referrals";
import { referralFieldLabels, ReferralFormField } from "@cbr/common/forms/Referral/referralFields";
import { newReferralStyles } from "../NewReferral.styles";

interface IFormProps {
    formikProps: FormikProps<any>;
}

const SafeGuardingForm = (_props: IFormProps) => {
    const { t } = useTranslation();

    return (
        <div>
            <FormLabel>{t("referral.safeguarding")}</FormLabel>
            <br />
            <br />
            <Box sx={newReferralStyles.fieldIndent}>
                <Field
                    component={TextField}
                    variant="outlined"
                    name={ReferralFormField.safeGuardingObservation}
                    label={referralFieldLabels[ReferralFormField.safeGuardingObservation]}
                    select
                    fullWidth
                    required
                >
                    {Object.entries(safeGuardingObservations).map(([value, name]) => (
                        <MenuItem key={value} value={value}>
                            {name}
                        </MenuItem>
                    ))}
                </Field>
                <br />
                <br />
                <Field
                    component={TextField}
                    fullWidth
                    label={referralFieldLabels[ReferralFormField.safeGuardingPersonInvolved]}
                    required
                    name={ReferralFormField.safeGuardingPersonInvolved}
                    variant="outlined"
                />
                <br />
                <br />
                <Field
                    component={TextField}
                    variant="outlined"
                    name={ReferralFormField.safeGuardingActionNeeded}
                    label={referralFieldLabels[ReferralFormField.safeGuardingActionNeeded]}
                    select
                    fullWidth
                    required
                >
                    {Object.entries(safeGuardingActionsNeeded).map(([value, name]) => (
                        <MenuItem key={value} value={value}>
                            {name}
                        </MenuItem>
                    ))}
                </Field>
            </Box>
        </div>
    );
};

export default SafeGuardingForm;
