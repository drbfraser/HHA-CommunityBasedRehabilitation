import React from "react";
import { useTranslation } from "react-i18next";
import { Field, FormikProps } from "formik";
import { CheckboxWithLabel } from "formik-mui";
import { FormLabel, styled } from "@mui/material";

import { referralFieldLabels, ReferralFormField } from "@cbr/common/forms/Referral/referralFields";
import * as Styled from "../NewReferral.styles";

const FieldContainer = styled(Styled.FieldIndent)({
    display: "flex",
    flexDirection: "column",
});

interface IFormProps {
    formikProps: FormikProps<any>;
}

const NutritionForm = (props: IFormProps) => {
    const { t } = useTranslation();

    return (
        <>
            <FormLabel>{t("referral.whatDoesClientNeed")}?</FormLabel>
            <FieldContainer>
                <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    key={ReferralFormField.emergencyFoodAidRequired}
                    name={ReferralFormField.emergencyFoodAidRequired}
                    color="secondary"
                    Label={{
                        label: referralFieldLabels[ReferralFormField.emergencyFoodAidRequired],
                    }}
                    onChange={(event: React.FormEvent<HTMLInputElement>) => {
                        props.formikProps.handleChange(event);
                    }}
                />
                <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    key={ReferralFormField.agricultureLivelihoodProgramEnrollment}
                    name={ReferralFormField.agricultureLivelihoodProgramEnrollment}
                    color="secondary"
                    Label={{
                        label: referralFieldLabels[
                            ReferralFormField.agricultureLivelihoodProgramEnrollment
                        ],
                    }}
                    onChange={(event: React.FormEvent<HTMLInputElement>) => {
                        props.formikProps.handleChange(event);
                    }}
                />
            </FieldContainer>
        </>
    );
};

export default NutritionForm;
