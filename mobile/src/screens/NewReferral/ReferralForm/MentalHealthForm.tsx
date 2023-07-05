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

const MentalHealthForm = (props: IFormProps) => {
    const styles = useStyles();
    const mentalConditions = new Map(Object.entries(mentalHealthConditions));
    return (
        <View>
            <Text />
            <Text style={styles.question}>Please select mental health referral</Text>
            <FormikExposedDropdownMenu
                field={ReferralFormField.mentalHealthCondition}
                valuesType="map"
                values={mentalConditions}
                formikProps={props.formikProps}
                items={mentalHealthConditions}
                fieldLabels={referralFieldLabels}
                mode="outlined"
            />
            {props.formikProps.values[ReferralFormField.mentalHealthCondition] ===
                MentalConditions.OTHER && (
                <View>
                    <Text />
                    <Text style={styles.question}>Please describe the referral</Text>
                    <TextInput
                        mode="outlined"
                        label={referralFieldLabels[ReferralFormField.mentalConditionOther]}
                        value={props.formikProps.values[ReferralFormField.mentalConditionOther]}
                        onChangeText={(value) => {
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
