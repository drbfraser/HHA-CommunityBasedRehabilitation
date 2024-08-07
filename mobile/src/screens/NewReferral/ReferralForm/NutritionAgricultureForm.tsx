import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Text, Paragraph, RadioButton, List, Checkbox } from "react-native-paper";
import useStyles from "../NewReferral.styles";
import { IFormProps, referralFieldLabels, ReferralFormField } from "@cbr/common";
import { useTranslation } from "react-i18next";
import TextCheckBox from "../../../components/TextCheckBox/TextCheckBox";

const NutritionAgricultureForm = (props: IFormProps) => {
    const styles = useStyles();
    const { t } = useTranslation();

    return (
        <View>
            <Text />
            <Text style={styles.question}>{t('referral.whatDoesClientNeed')}</Text>
            <List.Section>
                <TextCheckBox
                    field={ReferralFormField.emergencyFoodAidRequired}
                    value={props.formikProps.values[ReferralFormField.emergencyFoodAidRequired]}
                    label={referralFieldLabels[ReferralFormField.emergencyFoodAidRequired]}
                    setFieldValue={props.formikProps.setFieldValue}
                    setFieldTouched={props.formikProps.setFieldTouched}
                />
                <TextCheckBox
                    field={ReferralFormField.agricultureLivelihoodProgramEnrollment}
                    value={props.formikProps.values[ReferralFormField.agricultureLivelihoodProgramEnrollment]}
                    label={referralFieldLabels[ReferralFormField.agricultureLivelihoodProgramEnrollment]}
                    setFieldValue={props.formikProps.setFieldValue}
                    setFieldTouched={props.formikProps.setFieldTouched}
                />
            </List.Section>
        </View>
    );
};

export default NutritionAgricultureForm;
