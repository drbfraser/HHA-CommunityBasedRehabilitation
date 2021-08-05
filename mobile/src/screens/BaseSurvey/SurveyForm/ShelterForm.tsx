import React from "react";
import { View } from "react-native";
import { baseFieldLabels, BaseSurveyFormField, IFormProps } from "@cbr/common";
import TextCheckBox from "../../../components/TextCheckBox/TextCheckBox";

const ShelterForm = (props: IFormProps) => {
    return (
        <View>
            <TextCheckBox
                field={BaseSurveyFormField.haveShelter}
                value={props.formikProps.values[BaseSurveyFormField.haveShelter]}
                label={baseFieldLabels[BaseSurveyFormField.haveShelter]}
                setFieldValue={props.formikProps.setFieldValue}
                setFieldTouched={props.formikProps.setFieldTouched}
            />

            <TextCheckBox
                field={BaseSurveyFormField.accessItem}
                value={props.formikProps.values[BaseSurveyFormField.accessItem]}
                label={baseFieldLabels[BaseSurveyFormField.accessItem]}
                setFieldValue={props.formikProps.setFieldValue}
                setFieldTouched={props.formikProps.setFieldTouched}
            />
        </View>
    );
};

export default ShelterForm;
