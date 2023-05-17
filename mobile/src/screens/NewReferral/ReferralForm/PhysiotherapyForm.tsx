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

const PhysiotherapyForm = (props: IFormProps) => {
    const styles = useStyles();
    const disabilities = useDisabilities();

    return (
        <View>
            <Text />
            <Text style={styles.question}>What condition does the client have?</Text>
            <FormikExposedDropdownMenu
                field={ReferralFormField.condition}
                valuesType="map"
                values={disabilities}
                formikProps={props.formikProps}
                fieldLabels={referralFieldLabels}
                mode="outlined"
            />
            <Text />
            {props.formikProps.values[ReferralFormField.condition] ===
                getOtherDisabilityId(disabilities) && (
                <TextInput
                    mode="outlined"
                    label={referralFieldLabels[ReferralFormField.conditionOther]}
                    value={props.formikProps.values[ReferralFormField.conditionOther]}
                    onChangeText={(value: string) => {
                        props.formikProps.setFieldValue(ReferralFormField.conditionOther, value);
                        props.formikProps.setFieldTouched(ReferralFormField.conditionOther, true);
                    }}
                />
            )}
        </View>
    );
};

export default PhysiotherapyForm;
