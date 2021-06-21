import React from "react";
import { View } from "react-native";
import { fieldLabels, FormField, IFormProps } from "../formFields";
import TextCheckBox from "../../../../util/TextCheckBox";

const ShelterForm = (props: IFormProps) => {
    return (
        <View>
            <View
                style={{
                    paddingRight: 100,
                }}
            >
                <TextCheckBox
                    field={FormField.haveShelter}
                    value={props.formikProps.values[FormField.haveShelter]}
                    label={fieldLabels[FormField.haveShelter]}
                    setFieldValue={props.formikProps.setFieldValue}
                />
            </View>

            <View
                style={{
                    paddingRight: 10,
                }}
            >
                <TextCheckBox
                    field={FormField.accessItem}
                    value={props.formikProps.values[FormField.accessItem]}
                    label={fieldLabels[FormField.accessItem]}
                    setFieldValue={props.formikProps.setFieldValue}
                />
            </View>
        </View>
    );
};

export default ShelterForm;
