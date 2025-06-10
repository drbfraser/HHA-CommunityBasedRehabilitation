import React from "react";
import { View } from "react-native";
import { HelperText, TextInput } from "react-native-paper";
import { baseFieldLabels, BaseSurveyFormField, IFormProps } from "@cbr/common";
import useStyles from "../baseSurvey.style";
import TextCheckBox from "../../../components/TextCheckBox/TextCheckBox";

const EmpowermentForm = (props: IFormProps) => {
    const styles = useStyles();
    return (
        <View>
            <TextCheckBox
                field={BaseSurveyFormField.memOfOrgan}
                value={props.formikProps.values[BaseSurveyFormField.memOfOrgan]}
                label={baseFieldLabels[BaseSurveyFormField.memOfOrgan]}
                setFieldValue={props.formikProps.setFieldValue}
                setFieldTouched={props.formikProps.setFieldTouched}
            />
            {props.formikProps.values[BaseSurveyFormField.memOfOrgan] && (
                <>
                    <TextInput
                        mode="outlined"
                        label={BaseSurveyFormField.organization}
                        onChangeText={(value) => {
                            props.formikProps.setFieldTouched(
                                BaseSurveyFormField.organization,
                                true
                            );
                            props.formikProps.setFieldValue(
                                BaseSurveyFormField.organization,
                                value
                            );
                        }}
                    />
                    <HelperText
                        style={styles.errorText}
                        type="error"
                        visible={!!props.formikProps.errors[BaseSurveyFormField.organization]}
                    >
                        {props.formikProps.errors[BaseSurveyFormField.organization]}
                    </HelperText>
                </>
            )}

            <TextCheckBox
                field={BaseSurveyFormField.awareRight}
                value={props.formikProps.values[BaseSurveyFormField.awareRight]}
                label={baseFieldLabels[BaseSurveyFormField.awareRight]}
                setFieldValue={props.formikProps.setFieldValue}
                setFieldTouched={props.formikProps.setFieldTouched}
            />

            <TextCheckBox
                field={BaseSurveyFormField.ableInfluence}
                value={props.formikProps.values[BaseSurveyFormField.ableInfluence]}
                label={baseFieldLabels[BaseSurveyFormField.ableInfluence]}
                setFieldValue={props.formikProps.setFieldValue}
                setFieldTouched={props.formikProps.setFieldTouched}
            />
        </View>
    );
};

export default EmpowermentForm;
