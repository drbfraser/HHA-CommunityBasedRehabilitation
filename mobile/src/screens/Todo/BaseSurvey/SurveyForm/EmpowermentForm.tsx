import React from "react";
import { View } from "react-native";
import { HelperText, TextInput } from "react-native-paper";
import { fieldLabels, FormField, IFormProps } from "../formFields";

import TextCheckBox from "../../../../util/TextCheckBox";

const EmpowermentForm = (props: IFormProps) => {
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
                        onChangeText={(value) =>
                            props.formikProps.setFieldValue(FormField.organization, value)
                        }
                    />
                    <HelperText
                        type="error"
                        visible={props.formikProps.values[FormField.organization] === ""}
                    >
                        Please choose an item!!
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
