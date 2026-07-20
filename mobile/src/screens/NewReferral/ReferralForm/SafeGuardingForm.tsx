import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, TextInput } from "react-native-paper";
import {
    IFormProps,
    ReferralFormField,
    referralFieldLabels,
    safeGuardingActionsNeeded,
    safeGuardingObservations,
} from "@cbr/common";
import { useTranslation } from "react-i18next";
import FormikExposedDropdownMenu from "../../../components/ExposedDropdownMenu/FormikExposedDropdownMenu";
import useStyles from "../NewReferral.styles";

const safeGuardingStyles = StyleSheet.create({
    field: {
        marginTop: 8,
    },
});

const SafeGuardingForm = (props: IFormProps) => {
    const styles = useStyles();
    const observations = new Map(Object.entries(safeGuardingObservations));
    const actionsNeeded = new Map(Object.entries(safeGuardingActionsNeeded));
    const { t } = useTranslation();

    return (
        <View style={styles.formContainer}>
            <Text style={styles.question}>{t("referral.safeguardingObservation")}</Text>
            <FormikExposedDropdownMenu
                style={safeGuardingStyles.field}
                field={ReferralFormField.safeGuardingObservation}
                valuesType="map"
                values={observations}
                formikProps={props.formikProps}
                fieldLabels={referralFieldLabels}
                mode="outlined"
            />
            <View style={styles.formContainer}>
                <Text style={styles.question}>{t("referral.safeguardingPersonInvolved")}</Text>
                <TextInput
                    style={safeGuardingStyles.field}
                    mode="outlined"
                    label={referralFieldLabels[ReferralFormField.safeGuardingPersonInvolved]}
                    value={props.formikProps.values[ReferralFormField.safeGuardingPersonInvolved]}
                    onChangeText={(value) => {
                        props.formikProps.setFieldTouched(
                            ReferralFormField.safeGuardingPersonInvolved,
                            true
                        );
                        props.formikProps.setFieldValue(
                            ReferralFormField.safeGuardingPersonInvolved,
                            value
                        );
                    }}
                />
            </View>
            <View style={styles.formContainer}>
                <Text style={styles.question}>{t("referral.safeguardingActionNeeded")}</Text>
                <FormikExposedDropdownMenu
                    style={safeGuardingStyles.field}
                    field={ReferralFormField.safeGuardingActionNeeded}
                    valuesType="map"
                    values={actionsNeeded}
                    formikProps={props.formikProps}
                    fieldLabels={referralFieldLabels}
                    mode="outlined"
                />
            </View>
        </View>
    );
};

export default SafeGuardingForm;
