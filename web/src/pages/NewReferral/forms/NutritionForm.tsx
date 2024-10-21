import React from "react";
import { useTranslation } from "react-i18next";
import { Field, FormikProps } from "formik";
import { CheckboxWithLabel } from "formik-mui";
import { Box, FormLabel } from "@mui/material";

import { referralFieldLabels, ReferralFormField } from "@cbr/common/forms/Referral/referralFields";
import { newReferralStyles } from "../NewReferral.styles";

interface IFormProps {
    formikProps: FormikProps<any>;
}

const NutritionForm = (props: IFormProps) => {
    const { t } = useTranslation();

    return (
        <div>
            <FormLabel>{t("referral.whatDoesClientNeed")}?</FormLabel>
            <br />
            {/* todosd: replace Box with div */}
            <Box sx={newReferralStyles.fieldIndent}>
                <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    key={ReferralFormField.emergencyFoodAidRequired}
                    name={ReferralFormField.emergencyFoodAidRequired}
                    Label={{
                        label: referralFieldLabels[ReferralFormField.emergencyFoodAidRequired],
                    }}
                    onChange={(event: React.FormEvent<HTMLInputElement>) => {
                        props.formikProps.handleChange(event);
                    }}
                />
                <br />
                <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    key={ReferralFormField.agricultureLivelihoodProgramEnrollment}
                    name={ReferralFormField.agricultureLivelihoodProgramEnrollment}
                    Label={{
                        label: referralFieldLabels[
                            ReferralFormField.agricultureLivelihoodProgramEnrollment
                        ],
                    }}
                    onChange={(event: React.FormEvent<HTMLInputElement>) => {
                        props.formikProps.handleChange(event);
                    }}
                />
            </Box>
        </div>
    );
};

export default NutritionForm;
