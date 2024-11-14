import React from "react";
import { useTranslation } from "react-i18next";
import { Field, FormikProps } from "formik";
import { TextField } from "formik-mui";
import { Box, FormLabel, MenuItem } from "@mui/material";

import { getOtherDisabilityId, useDisabilities } from "@cbr/common/util/hooks/disabilities";
import { referralFieldLabels, ReferralFormField } from "@cbr/common/forms/Referral/referralFields";
import { newReferralStyles } from "../NewReferral.styles";

interface IFormProps {
    formikProps: FormikProps<any>;
}

const PhysiotherapyForm = (props: IFormProps) => {
    const { t } = useTranslation();
    const disabilities = useDisabilities(t);

    return (
        <div>
            <FormLabel>{t("referral.whatCondition")}</FormLabel>
            <br />
            <br />
            <Box sx={newReferralStyles.fieldIndent}>
                <Field
                    component={TextField}
                    fullWidth
                    select
                    label={referralFieldLabels[ReferralFormField.condition]}
                    required
                    name={ReferralFormField.condition}
                    variant="outlined"
                >
                    {Array.from(disabilities).map(([id, name]) => (
                        <MenuItem key={id} value={id}>
                            {name}
                        </MenuItem>
                    ))}
                </Field>
                {props.formikProps.values[ReferralFormField.condition] ===
                    getOtherDisabilityId(disabilities) && (
                    <div>
                        <br />
                        <Field
                            required
                            fullWidth
                            component={TextField}
                            name={ReferralFormField.conditionOther}
                            label={referralFieldLabels[ReferralFormField.conditionOther]}
                            variant="outlined"
                        />
                    </div>
                )}
            </Box>
        </div>
    );
};

export default PhysiotherapyForm;
