import React from "react";
import { useTranslation } from "react-i18next";
import { Field, FormikProps } from "formik";
import { RadioGroup } from "formik-mui";
import { FormLabel, Radio } from "@mui/material";

import { orthoticInjuryLocations, prostheticInjuryLocations } from "@cbr/common/util/referrals";
import { referralFieldLabels, ReferralFormField } from "@cbr/common/forms/Referral/referralFields";

interface IFormProps {
    formikProps: FormikProps<any>;
}

const ProstheticOrthoticForm = (props: IFormProps, serviceType: ReferralFormField) => {
    const { t } = useTranslation();

    const injuryLocations =
        serviceType === ReferralFormField.prosthetic
            ? prostheticInjuryLocations
            : orthoticInjuryLocations;

    return (
        <div>
            <FormLabel>{t("referral.whereIsInjury")}?</FormLabel>
            <Field
                component={RadioGroup}
                name={`${serviceType}_injury_location`}
                label={referralFieldLabels[serviceType]}
            >
                {Object.entries(injuryLocations).map(([value, name]) => (
                    <label key={value}>
                        <Field
                            type="radio"
                            component={Radio}
                            value={value}
                            name={`${serviceType}_injury_location`}
                        />
                        {name}
                    </label>
                ))}
            </Field>
        </div>
    );
};

export default ProstheticOrthoticForm;
