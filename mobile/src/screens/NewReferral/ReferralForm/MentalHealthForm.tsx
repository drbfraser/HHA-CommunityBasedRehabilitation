import React from "react";
import { View } from "react-native";
import { HelperText, Text, TextInput } from "react-native-paper";
import useStyles from "../NewReferral.styles";
import FormikExposedDropdownMenu from "../../../components/ExposedDropdownMenu/FormikExposedDropdownMenu";
import {
    IFormProps,
    MentalConditions,
    ReferralFormField,
    mentalHealthConditions,
    referralFieldLabels,
} from "@cbr/common";
import { useTranslation } from "react-i18next";

const MentalHealthForm = (props: IFormProps) => {
    const styles = useStyles();
    const mentalConditions = new Map(Object.entries(mentalHealthConditions));
    const { t } = useTranslation();
    return (
        <View style={styles.formContainer}>
            <Text style={styles.question}>{t("referral.selectMentalHealthReferral")}</Text>
            <FormikExposedDropdownMenu
                field={ReferralFormField.mentalHealthCondition}
                valuesType="map"
                values={mentalConditions}
                formikProps={props.formikProps}
                fieldLabels={referralFieldLabels}
                mode="outlined"
            />
            {props.formikProps.values[ReferralFormField.mentalHealthCondition] ===
                MentalConditions.OTHER && (
                <View style={styles.formContainer}>
                    <Text style={styles.question}>{t("referral.describeReferral")}</Text>
                    <TextInput
                        mode="outlined"
                        label={referralFieldLabels[ReferralFormField.mentalConditionOther]}
                        value={props.formikProps.values[ReferralFormField.mentalConditionOther]}
                        onChangeText={(value) => {
                            props.formikProps.setFieldTouched(
                                ReferralFormField.mentalConditionOther,
                                true
                            );
                            props.formikProps.setFieldValue(
                                ReferralFormField.mentalConditionOther,
                                value
                            );
                        }}
                    />
                </View>
            )}
        </View>
    );
};

export default MentalHealthForm;
