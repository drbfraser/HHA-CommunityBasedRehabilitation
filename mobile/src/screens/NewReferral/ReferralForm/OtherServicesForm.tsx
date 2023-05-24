import React from "react";
import { View } from "react-native";
import { Text, TextInput, HelperText } from "react-native-paper";
import useStyles from "../NewReferral.styles";
import { referralFieldLabels, ReferralFormField, IFormProps } from "@cbr/common";
import { otherServices } from "@cbr/common";
import FormikExposedDropdownMenu from "../../../components/ExposedDropdownMenu/FormikExposedDropdownMenu";

const OtherServicesForm = (props: IFormProps) => {
    const styles = useStyles();
    const services = new Map(Object.entries(otherServices));
    return (
        <View>
            <Text />
            <Text style={styles.question}>Please select another referral</Text>
            <FormikExposedDropdownMenu
                field={ReferralFormField.otherDescription}
                valuesType="map"
                values={services}
                formikProps={props.formikProps}
                items={otherServices}
                fieldLabels={referralFieldLabels}
                mode="outlined"
            />
            {props.formikProps.values[ReferralFormField.otherDescription] ===
                otherServices.Other && (
                <View>
                    <Text />
                    <Text style={styles.question}>Please describe the referral</Text>
                    <TextInput
                        mode="outlined"
                        label={referralFieldLabels[ReferralFormField.referralOther]}
                        value={props.formikProps.values[ReferralFormField.referralOther]}
                        onChangeText={(value) => {
                            props.formikProps.setFieldValue(ReferralFormField.referralOther, value);
                        }}
                    />

                    <HelperText
                        style={styles.errorText}
                        type="error"
                        visible={!!props.formikProps.errors[ReferralFormField.otherDescription]}
                    >
                        {props.formikProps.errors[ReferralFormField.otherDescription]}
                    </HelperText>
                </View>
            )}
        </View>
    );
};

export default OtherServicesForm;
