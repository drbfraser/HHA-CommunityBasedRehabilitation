import React from "react";
import { useTranslation } from "react-i18next";
import { Field, FormikProps } from "formik";
import { TextField } from "formik-material-ui";
import { FormLabel, MenuItem } from "@material-ui/core";

import { getOtherDisabilityId, useDisabilities } from "@cbr/common/util/hooks/disabilities";
import { referralFieldLabels, ReferralFormField } from "@cbr/common/forms/Referral/referralFields";
import { useStyles } from "../NewReferral.styles";

interface IFormProps {
    formikProps: FormikProps<any>;
}

const PhysiotherapyForm = (props: IFormProps) => {
    const { t } = useTranslation();
    const styles = useStyles();
    const disabilities = useDisabilities();

    return (
        <div>
            <FormLabel>{t("referral.whatCondition")}?</FormLabel>
            <br />
            <br />
            <div className={styles.fieldIndent}>
                <Field
                    component={TextField}
                    fullWidth
                    select
                    label={referralFieldLabels[ReferralFormField.condition]}
                    required
                    name={ReferralFormField.condition}
                    variant="outlined"
                >
                    {/* TODO: translate these disabilities */}
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
            </div>
        </div>
    );
};

export default PhysiotherapyForm;
