import React from "react";
import { View } from "react-native";
import { Text, TextInput } from "react-native-paper";
import {
    getOtherDisabilityId,
    IFormProps,
    referralFieldLabels,
    ReferralFormField,
    useDisabilities,
} from "@cbr/common";
import useStyles from "../NewReferral.styles";
import FormikExposedDropdownMenu from "../../../components/ExposedDropdownMenu/FormikExposedDropdownMenu";
import { useTranslation } from "react-i18next";

const PhysiotherapyForm = (props: IFormProps) => {
    const styles = useStyles();
    const { t } = useTranslation();
    const disabilities = useDisabilities(t);

    return (
        <View style={styles.formContainer}>
            <Text style={styles.question}>{t("referral.whatCondition")}</Text>
            <FormikExposedDropdownMenu
                field={ReferralFormField.condition}
                valuesType="map"
                values={disabilities}
                formikProps={props.formikProps}
                fieldLabels={referralFieldLabels}
                mode="outlined"
            />
            {props.formikProps.values[ReferralFormField.condition] ===
                getOtherDisabilityId(disabilities) && (
                    <View style={styles.formContainer}>
                        <TextInput
                            mode="outlined"
                            label={referralFieldLabels[ReferralFormField.conditionOther]}
                            value={props.formikProps.values[ReferralFormField.conditionOther]}
                            onChangeText={(value: string) => {
                                props.formikProps.setFieldTouched(ReferralFormField.conditionOther, true);
                                props.formikProps.setFieldValue(ReferralFormField.conditionOther, value);
                            }}
                        />
                </View>
            )}
        </View>
    );
};

export default PhysiotherapyForm;
