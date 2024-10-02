import React from "react";
import { useTranslation } from "react-i18next";
import { Field, FormikProps } from "formik";
import { CheckboxWithLabel, RadioGroup, TextField } from "formik-material-ui";
import { FormLabel, InputAdornment, Radio } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

import { wheelchairExperiences } from "@cbr/common/util/referrals";
import { referralFieldLabels, ReferralFormField } from "@cbr/common/forms/Referral/referralFields";
import { useStyles } from "../NewReferral.styles";
import { PhotoView } from "components/ReferralPhotoView/PhotoView";

interface IFormProps {
    formikProps: FormikProps<any>;
}

const WheelchairForm = (props: IFormProps) => {
    const { t } = useTranslation();
    const styles = useStyles();

    return (
        <div>
            <FormLabel>{t("referral.whatTypeOfWheelchair")}?</FormLabel>
            <Field
                component={RadioGroup}
                name={ReferralFormField.wheelchairExperience}
                label={referralFieldLabels[ReferralFormField.wheelchairExperience]}
            >
                {Object.entries(wheelchairExperiences).map(([value, name]) => (
                    <label key={value}>
                        <Field
                            component={Radio}
                            type="radio"
                            name={ReferralFormField.wheelchairExperience}
                            value={value}
                        />
                        {name}
                    </label>
                ))}
            </Field>
            <br />
            <FormLabel>{t("referral.clientHipWidth")}?</FormLabel>
            <br />
            <div className={`${styles.fieldIndent}`}>
                <Field
                    className={styles.hipWidth}
                    component={TextField}
                    type="number"
                    name={ReferralFormField.hipWidth}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">{t("referral.inches")}</InputAdornment>
                        ),
                    }}
                />
            </div>
            <br />
            <FormLabel>{t("referral.wheelchairInformation")}</FormLabel>
            <br />
            <div className={styles.fieldIndent}>
                <Field
                    component={CheckboxWithLabel}
                    type="checkbox"
                    name={ReferralFormField.wheelchairOwned}
                    Label={{ label: referralFieldLabels[ReferralFormField.wheelchairOwned] }}
                />
                <br />
                {props.formikProps.values[ReferralFormField.wheelchairOwned] && (
                    <Field
                        component={CheckboxWithLabel}
                        type="checkbox"
                        name={ReferralFormField.wheelchairRepairable}
                        Label={{
                            label: referralFieldLabels[ReferralFormField.wheelchairRepairable],
                        }}
                    />
                )}
            </div>
            {props.formikProps.values[ReferralFormField.wheelchairOwned] &&
                props.formikProps.values[ReferralFormField.wheelchairRepairable] && (
                    <>
                        {/* TODO: translate */}
                        <Alert severity="info">Please bring wheelchair to the center</Alert>
                        <br />
                        <PhotoView
                            onPictureChange={(pictureURL) => {
                                props.formikProps.setFieldValue(
                                    ReferralFormField.picture,
                                    pictureURL
                                );
                            }}
                        ></PhotoView>
                    </>
                )}
        </div>
    );
};

export default WheelchairForm;
