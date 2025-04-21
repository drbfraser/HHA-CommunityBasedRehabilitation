import React from "react";
import { View } from "react-native";
import { Text, TextInput, HelperText } from "react-native-paper";
import useStyles from "../NewReferral.styles";
import { IFormProps, Impairments, ReferralFormField, referralFieldLabels } from "@cbr/common";
import { otherServices } from "@cbr/common";
import FormikExposedDropdownMenu from "../../../components/ExposedDropdownMenu/FormikExposedDropdownMenu";
import { useTranslation } from "react-i18next";

const OtherServicesForm = (props: IFormProps) => {
    const styles = useStyles();
    const services = new Map(Object.entries(otherServices));
    const { t } = useTranslation();

    const helperText = props.formikProps.errors[ReferralFormField.otherDescription];
    return (
        <View style={styles.formContainer}>
            <Text style={styles.question}>{t("referral.selectAnotherReferral")}</Text>
            <FormikExposedDropdownMenu
                field={ReferralFormField.otherDescription}
                valuesType="map"
                values={services}
                formikProps={props.formikProps}
                fieldLabels={referralFieldLabels}
                mode="outlined"
            />
            {props.formikProps.values[ReferralFormField.otherDescription] === Impairments.OTHER && (
                <View style={styles.formContainer}>
                    <Text style={styles.question}>{t("referral.describeReferral")}</Text>
                    <TextInput
                        mode="outlined"
                        label={referralFieldLabels[ReferralFormField.referralOther]}
                        value={props.formikProps.values[ReferralFormField.referralOther]}
                        onChangeText={(value) => {
                            props.formikProps.setFieldTouched(
                                ReferralFormField.referralOther,
                                true
                            );
                            props.formikProps.setFieldValue(ReferralFormField.referralOther, value);
                        }}
                    />

                    <HelperText style={styles.errorText} type="error" visible={!!helperText}>
                        {typeof helperText === "string" ? helperText : null}
                    </HelperText>
                </View>
            )}
        </View>
    );
};

export default OtherServicesForm;
