import React from "react";
import { View } from "react-native";
import TextCheckBox from "../../../components/TextCheckBox/TextCheckBox";
import { Text, Paragraph, RadioButton, List, TextInput, HelperText } from "react-native-paper";
import useStyles from "../NewReferral.styles";
import { fieldLabels, FormField, IFormProps } from "../formFields";

const OtherServicesForm = (props: IFormProps) => {
    const styles = useStyles();
    return (
        <View>
            <Text />
            <Text>Please describe the referral</Text>
            <TextInput
                mode="outlined"
                label={fieldLabels[FormField.otherDescription]}
                value={props.formikProps.values[FormField.otherDescription]}
                onChangeText={(value) =>
                    props.formikProps.setFieldValue(FormField.otherDescription, value)
                }
            />
            <HelperText
                style={styles.errorText}
                type="error"
                visible={!!props.formikProps.errors[FormField.otherDescription]}
            >
                {props.formikProps.errors[FormField.otherDescription]}
            </HelperText>
        </View>
    );
};

export default OtherServicesForm;
