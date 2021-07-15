import React from "react";
import { View } from "react-native";
import { Text, TextInput, HelperText } from "react-native-paper";
import useStyles from "../NewReferral.styles";
import { referralFieldLabels, ReferralFormField, IFormProps } from "@cbr/common";

const OtherServicesForm = (props: IFormProps) => {
    const styles = useStyles();
    return (
        <View>
            <Text />
            <Text>Please describe the referral</Text>
            <TextInput
                mode="outlined"
                label={referralFieldLabels[ReferralFormField.otherDescription]}
                value={props.formikProps.values[ReferralFormField.otherDescription]}
                onChangeText={(value) =>
                    props.formikProps.setFieldValue(ReferralFormField.otherDescription, value)
                }
            />
            <HelperText
                style={styles.errorText}
                type="error"
                visible={!!props.formikProps.errors[ReferralFormField.otherDescription]}
            >
                {props.formikProps.errors[ReferralFormField.otherDescription]}
            </HelperText>
        </View>
    );
};

export default OtherServicesForm;
