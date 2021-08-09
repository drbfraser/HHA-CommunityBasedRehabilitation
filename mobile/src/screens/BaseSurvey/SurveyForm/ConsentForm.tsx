import React from "react";
import { View } from "react-native";
import { baseFieldLabels, BaseSurveyFormField, IFormProps } from "@cbr/common";
import TextCheckBox from "../../../components/TextCheckBox/TextCheckBox";

const ConsentForm = (props: IFormProps) => {
    return (
        <View>
            <TextCheckBox
                field={BaseSurveyFormField.surveyConsent}
                value={props.formikProps.values[BaseSurveyFormField.surveyConsent]}
                label={baseFieldLabels[BaseSurveyFormField.surveyConsent]}
                setFieldTouched={props.formikProps.setFieldTouched}
                setFieldValue={props.formikProps.setFieldValue}
            />
        </View>
    );
};

export default ConsentForm;
