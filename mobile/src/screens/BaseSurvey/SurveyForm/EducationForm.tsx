import React from "react";
import { View } from "react-native";
import { HelperText, Text } from "react-native-paper";
import {
    grade,
    reasonNotSchool,
    baseFieldLabels,
    BaseSurveyFormField,
    IFormProps,
} from "@cbr/common";
import useStyles from "../baseSurvey.style";
import TextCheckBox from "../../../components/TextCheckBox/TextCheckBox";
import TextPicker, { IPickerChoice } from "../../../components/TextPicker/TextPicker";

const EducationForm = (props: IFormProps) => {
    const styles = useStyles();

    return (
        <View>
            <TextCheckBox
                field={BaseSurveyFormField.goSchool}
                value={props.formikProps.values[BaseSurveyFormField.goSchool]}
                label={baseFieldLabels[BaseSurveyFormField.goSchool]}
                setFieldValue={props.formikProps.setFieldValue}
            />

            {props.formikProps.values[BaseSurveyFormField.goSchool] ? (
                <View>
                    <Text style={styles.pickerQuestion}>What grade?</Text>

                    <TextPicker
                        field={BaseSurveyFormField.grade}
                        choices={Object.entries(grade).map(
                            (key) =>
                                ({
                                    value: key[0],
                                    label: key[1].name,
                                } as IPickerChoice)
                        )}
                        selectedValue={props.formikProps.values[BaseSurveyFormField.grade]}
                        setFieldValue={props.formikProps.setFieldValue}
                        setFieldTouched={props.formikProps.setFieldTouched}
                    />

                    <HelperText
                        style={styles.errorText}
                        type="error"
                        visible={!!props.formikProps.errors[BaseSurveyFormField.grade]}
                    >
                        {props.formikProps.errors[BaseSurveyFormField.grade]}
                    </HelperText>
                </View>
            ) : (
                <View>
                    <Text style={styles.pickerQuestion}>Why do you not go to school?</Text>
                    <TextPicker
                        field={BaseSurveyFormField.reasonNotSchool}
                        choices={Object.entries(reasonNotSchool).map(
                            (key) =>
                                ({
                                    value: key[0],
                                    label: key[1],
                                } as IPickerChoice)
                        )}
                        selectedValue={
                            props.formikProps.values[BaseSurveyFormField.reasonNotSchool]
                        }
                        setFieldValue={props.formikProps.setFieldValue}
                        setFieldTouched={props.formikProps.setFieldTouched}
                    />
                    <HelperText
                        style={styles.errorText}
                        type="error"
                        visible={!!props.formikProps.errors[BaseSurveyFormField.reasonNotSchool]}
                    >
                        Reason is a required field
                    </HelperText>
                </View>
            )}

            <TextCheckBox
                field={BaseSurveyFormField.beenSchool}
                value={props.formikProps.values[BaseSurveyFormField.beenSchool]}
                label={baseFieldLabels[BaseSurveyFormField.beenSchool]}
                setFieldValue={props.formikProps.setFieldValue}
            />

            <TextCheckBox
                field={BaseSurveyFormField.wantSchool}
                value={props.formikProps.values[BaseSurveyFormField.wantSchool]}
                label={baseFieldLabels[BaseSurveyFormField.wantSchool]}
                setFieldValue={props.formikProps.setFieldValue}
            />
        </View>
    );
};

export default EducationForm;
