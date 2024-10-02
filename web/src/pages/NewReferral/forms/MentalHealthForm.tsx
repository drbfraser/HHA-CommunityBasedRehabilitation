import React from "react";
import { useTranslation } from "react-i18next";
import { Field, FormikProps } from "formik";
import { TextField } from "formik-material-ui";
import { FormLabel, MenuItem } from "@material-ui/core";

import { mentalHealthConditions, MentalConditions } from "@cbr/common/util/referrals";
import { referralFieldLabels, ReferralFormField } from "@cbr/common/forms/Referral/referralFields";
import { useStyles } from "../NewReferral.styles";

interface IFormProps {
    formikProps: FormikProps<any>;
}

const MentalHealthForm = (props: IFormProps) => {
    const { t } = useTranslation();
    const styles = useStyles();

    return (
        <div>
            <FormLabel>{t("referral.selectMentalHealthReferral")}</FormLabel>
            <br />
            <br />
            <div className={styles.fieldIndent}>
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
            </div>
        </div>
    );
};

export default MentalHealthForm;
