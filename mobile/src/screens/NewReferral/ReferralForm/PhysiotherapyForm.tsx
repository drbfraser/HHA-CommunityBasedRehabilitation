import React from "react";
import { View } from "react-native";
import { Text, HelperText } from "react-native-paper";
import { ReferralFormField } from "@cbr/common";
import { IFormProps, useDisabilities } from "@cbr/common";
import TextPicker from "../../../components/TextPicker/TextPicker";
import useStyles from "../NewReferral.styles";

const PhysiotherapyForm = (props: IFormProps) => {
    const styles = useStyles();
    const disabilities = useDisabilities();

    return (
        <View>
            <Text />
            <Text style={styles.question}>What condition does the client have?</Text>
            <TextPicker
                field={ReferralFormField.condition}
                choices={Array.from(disabilities.entries()).map(([key, value]) => ({
                    value: key,
                    label: value,
                }))}
                selectedValue={props.formikProps.values[ReferralFormField.condition]}
                setFieldValue={props.formikProps.setFieldValue}
                setFieldTouched={props.formikProps.setFieldTouched}
            />
            <HelperText
                style={styles.errorText}
                type="error"
                visible={!!props.formikProps.errors[ReferralFormField.condition]}
            >
                {props.formikProps.errors[ReferralFormField.condition]}
            </HelperText>
        </View>
    );
};

export default PhysiotherapyForm;
