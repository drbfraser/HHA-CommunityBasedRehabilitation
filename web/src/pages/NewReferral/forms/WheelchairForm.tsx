import React from "react";
import { useTranslation } from "react-i18next";
import { Field, FormikProps } from "formik";
import { CheckboxWithLabel, RadioGroup, TextField } from "formik-mui";
import { Alert, FormLabel, InputAdornment, Radio, styled } from "@mui/material";

import { wheelchairExperiences } from "@cbr/common/util/referrals";
import { referralFieldLabels, ReferralFormField } from "@cbr/common/forms/Referral/referralFields";
import * as Styled from "../NewReferral.styles";
import { PhotoView } from "components/ReferralPhotoView/PhotoView";

const Container = styled("div")({
    display: "flex",
    flexDirection: "column",
    gap: "1.5em",
});

interface IFormProps {
    formikProps: FormikProps<any>;
}

const WheelchairForm = ({ formikProps }: IFormProps) => {
    const { t } = useTranslation();

    return (
        <Container>
            <div>
                <FormLabel>{t("referral.whatTypeOfWheelchair")}</FormLabel>
                <Field
                    component={RadioGroup}
                    name={ReferralFormField.wheelchairExperience}
                    label={referralFieldLabels[ReferralFormField.wheelchairExperience]}
                >
                    {Object.entries(wheelchairExperiences).map(([value, name]) => (
                        <label key={value}>
                            <Field
                                component={Radio}
                                color="secondary"
                                type="radio"
                                name={ReferralFormField.wheelchairExperience}
                                value={value}
                            />
                            {name}
                        </label>
                    ))}
                </Field>
            </div>

            <div>
                <FormLabel>{t("referral.clientHipWidth")}</FormLabel>
                <Styled.FieldIndent>
                    <Field
                        sx={{ maxWidth: "160px" }}
                        component={TextField}
                        variant="standard"
                        type="number"
                        name={ReferralFormField.hipWidth}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {t("referral.inches")}
                                </InputAdornment>
                            ),
                        }}
                    />
                </Styled.FieldIndent>
            </div>

            <div>
                <FormLabel>{t("referral.wheelchairInformation")}</FormLabel>
                <Styled.FieldIndent sx={{ display: "flex", flexDirection: "column" }}>
                    <Field
                        component={CheckboxWithLabel}
                        type="checkbox"
                        name={ReferralFormField.wheelchairOwned}
                        Label={{ label: referralFieldLabels[ReferralFormField.wheelchairOwned] }}
                    />
                    {formikProps.values[ReferralFormField.wheelchairOwned] && (
                        <Field
                            component={CheckboxWithLabel}
                            type="checkbox"
                            name={ReferralFormField.wheelchairRepairable}
                            Label={{
                                label: referralFieldLabels[ReferralFormField.wheelchairRepairable],
                            }}
                        />
                    )}
                </Styled.FieldIndent>
            </div>

            {formikProps.values[ReferralFormField.wheelchairOwned] &&
                formikProps.values[ReferralFormField.wheelchairRepairable] && (
                    <div>
                        <Alert sx={{ marginBottom: "1.5rem" }} severity="info">
                            {t("referral.bringWheelchair")}
                        </Alert>
                        <PhotoView
                            onPictureChange={(pictureURL) => {
                                formikProps.setFieldValue(ReferralFormField.picture, pictureURL);
                            }}
                        />
                    </div>
                )}
        </Container>
    );
};

export default WheelchairForm;
