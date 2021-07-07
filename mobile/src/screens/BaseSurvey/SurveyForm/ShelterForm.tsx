import React from "react";
import { View } from "react-native";
import { fieldLabels, FormField, IFormProps } from "@cbr/common";
import TextCheckBox from "../../../components/TextCheckBox/TextCheckBox";

const ShelterForm = (props: IFormProps) => {
    return (
        <View>
            <TextCheckBox
                field={FormField.haveShelter}
                value={props.formikProps.values[FormField.haveShelter]}
                label={fieldLabels[FormField.haveShelter]}
                setFieldValue={props.formikProps.setFieldValue}
            />

            <TextCheckBox
                field={FormField.accessItem}
                value={props.formikProps.values[FormField.accessItem]}
                label={fieldLabels[FormField.accessItem]}
                setFieldValue={props.formikProps.setFieldValue}
            />
        </View>
    );
};

export default ShelterForm;
