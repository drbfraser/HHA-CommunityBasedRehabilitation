import React from "react";
import { View } from "react-native";
import { HelperText, TextInput } from "react-native-paper";
import { fieldLabels, FormField, IFormProps } from "../formFields";
import useStyles from "../baseSurvey.style";
import TextCheckBox from "../../../components/TextCheckBox";

const EmpowermentForm = (props: IFormProps) => {
    const styles = useStyles();
    return (
        <View>
            <TextCheckBox
                field={FormField.memOfOrgan}
                value={props.formikProps.values[FormField.memOfOrgan]}
                label={fieldLabels[FormField.memOfOrgan]}
                setFieldValue={props.formikProps.setFieldValue}
            />
            {props.formikProps.values[FormField.memOfOrgan] && (
                <>
                    <TextInput
                        mode="outlined"
                        label={FormField.organization}
                        onChangeText={(value) => {
                            // props.formikProps.setFieldTouched(FormField.organization, true);
                            props.formikProps.setFieldValue(FormField.organization, value);
                        }}
                    />
                    <HelperText
                        style={styles.errorText}
                        type="error"
                        visible={props.formikProps.values[FormField.organization] === ""}
                    >
                        {props.formikProps.errors[FormField.organization]}
                    </HelperText>
                </>
            )}

            <TextCheckBox
                field={FormField.awareRight}
                value={props.formikProps.values[FormField.awareRight]}
                label={fieldLabels[FormField.awareRight]}
                setFieldValue={props.formikProps.setFieldValue}
            />

            <TextCheckBox
                field={FormField.ableInfluence}
                value={props.formikProps.values[FormField.ableInfluence]}
                label={fieldLabels[FormField.ableInfluence]}
                setFieldValue={props.formikProps.setFieldValue}
            />
        </View>
    );
};

export default EmpowermentForm;
