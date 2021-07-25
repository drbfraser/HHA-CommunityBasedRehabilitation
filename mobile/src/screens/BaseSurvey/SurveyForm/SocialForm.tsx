import React from "react";
import TextCheckBox from "../../../components/TextCheckBox/TextCheckBox";
import { View } from "react-native";
import { baseFieldLabels, BaseSurveyFormField, IFormProps } from "@cbr/common";

const SocialForm = (props: IFormProps) => {
    return (
        <View>
            <TextCheckBox
                field={BaseSurveyFormField.feelValue}
                value={props.formikProps.values[BaseSurveyFormField.feelValue]}
                label={baseFieldLabels[BaseSurveyFormField.feelValue]}
                setFieldValue={props.formikProps.setFieldValue}
            />

            <TextCheckBox
                field={BaseSurveyFormField.feelIndependent}
                value={props.formikProps.values[BaseSurveyFormField.feelIndependent]}
                label={baseFieldLabels[BaseSurveyFormField.feelIndependent]}
                setFieldValue={props.formikProps.setFieldValue}
            />

            <TextCheckBox
                field={BaseSurveyFormField.ableInSocial}
                value={props.formikProps.values[BaseSurveyFormField.ableInSocial]}
                label={baseFieldLabels[BaseSurveyFormField.ableInSocial]}
                setFieldValue={props.formikProps.setFieldValue}
            />
            <TextCheckBox
                field={BaseSurveyFormField.disabiAffectSocial}
                value={props.formikProps.values[BaseSurveyFormField.disabiAffectSocial]}
                label={baseFieldLabels[BaseSurveyFormField.disabiAffectSocial]}
                setFieldValue={props.formikProps.setFieldValue}
            />
            <TextCheckBox
                field={BaseSurveyFormField.disabiDiscrimination}
                value={props.formikProps.values[BaseSurveyFormField.disabiDiscrimination]}
                label={baseFieldLabels[BaseSurveyFormField.disabiDiscrimination]}
                setFieldValue={props.formikProps.setFieldValue}
            />
        </View>
    );
};

export default SocialForm;
