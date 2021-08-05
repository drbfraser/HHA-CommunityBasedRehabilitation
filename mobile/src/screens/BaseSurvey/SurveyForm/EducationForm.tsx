import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import {
    baseFieldLabels,
    BaseSurveyFormField,
    grade,
    IFormProps,
    reasonNotSchool,
} from "@cbr/common";
import useStyles from "../baseSurvey.style";
import TextCheckBox from "../../../components/TextCheckBox/TextCheckBox";
import FormikExposedDropdownMenu from "../../../components/ExposedDropdownMenu/FormikExposedDropdownMenu";

const EducationForm = (props: IFormProps) => {
    const styles = useStyles();

    return (
        <View>
            <TextCheckBox
                field={BaseSurveyFormField.goSchool}
                value={props.formikProps.values[BaseSurveyFormField.goSchool]}
                label={baseFieldLabels[BaseSurveyFormField.goSchool]}
                setFieldValue={props.formikProps.setFieldValue}
                setFieldTouched={props.formikProps.setFieldTouched}
            />

            {props.formikProps.values[BaseSurveyFormField.goSchool] ? (
                <View>
                    <Text style={styles.pickerQuestion}>What grade?</Text>
                    <FormikExposedDropdownMenu
                        field={BaseSurveyFormField.grade}
                        valuesType="record-string"
                        values={Object.entries(grade).reduce((accumulator, [value, { name }]) => {
                            accumulator[value] = name;
                            return accumulator;
                        }, {})}
                        formikProps={props.formikProps}
                        fieldLabels={baseFieldLabels}
                        mode="outlined"
                    />
                </View>
            ) : (
                <View>
                    <Text style={styles.pickerQuestion}>Why do you not go to school?</Text>
                    <FormikExposedDropdownMenu
                        field={BaseSurveyFormField.reasonNotSchool}
                        valuesType="record-string"
                        values={reasonNotSchool}
                        formikProps={props.formikProps}
                        fieldLabels={baseFieldLabels}
                        mode="outlined"
                    />
                </View>
            )}

            <TextCheckBox
                field={BaseSurveyFormField.beenSchool}
                value={props.formikProps.values[BaseSurveyFormField.beenSchool]}
                label={baseFieldLabels[BaseSurveyFormField.beenSchool]}
                setFieldValue={props.formikProps.setFieldValue}
                setFieldTouched={props.formikProps.setFieldTouched}
            />

            <TextCheckBox
                field={BaseSurveyFormField.wantSchool}
                value={props.formikProps.values[BaseSurveyFormField.wantSchool]}
                label={baseFieldLabels[BaseSurveyFormField.wantSchool]}
                setFieldValue={props.formikProps.setFieldValue}
                setFieldTouched={props.formikProps.setFieldTouched}
            />
        </View>
    );
};

export default EducationForm;
