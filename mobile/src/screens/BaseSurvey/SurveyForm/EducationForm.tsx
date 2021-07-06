import React from "react";
import { View } from "react-native";
import { HelperText, Text } from "react-native-paper";
import { grade, reasonNotSchool, fieldLabels, FormField, IFormProps } from "@cbr/common";
import useStyles from "../baseSurvey.style";
import TextCheckBox from "../../../components/TextCheckBox/TextCheckBox";
import TextPicker, { IPickerChoice } from "../../../components/TextPicker/TextPicker";

const EducationForm = (props: IFormProps) => {
    const styles = useStyles();

    return (
        <View>
            <TextCheckBox
                field={FormField.goSchool}
                value={props.formikProps.values[FormField.goSchool]}
                label={fieldLabels[FormField.goSchool]}
                setFieldValue={props.formikProps.setFieldValue}
            />

            {props.formikProps.values[FormField.goSchool] ? (
                <View>
                    <Text style={styles.pickerQuestion}>What grade?</Text>

                    <TextPicker
                        field={FormField.grade}
                        choices={Object.entries(grade).map(
                            (key) =>
                                ({
                                    value: key[0],
                                    label: key[1].name,
                                } as IPickerChoice)
                        )}
                        selectedValue={props.formikProps.values[FormField.grade]}
                        setFieldValue={props.formikProps.setFieldValue}
                        setFieldTouched={props.formikProps.setFieldTouched}
                    />

                    <HelperText
                        style={styles.errorText}
                        type="error"
                        visible={!!props.formikProps.errors[FormField.grade]}
                    >
                        {props.formikProps.errors[FormField.grade]}
                    </HelperText>
                </View>
            ) : (
                <View>
                    <Text style={styles.pickerQuestion}>Why do you not go to school?</Text>
                    <TextPicker
                        field={FormField.reasonNotSchool}
                        choices={Object.entries(reasonNotSchool).map(
                            (key) =>
                                ({
                                    value: key[0],
                                    label: key[1],
                                } as IPickerChoice)
                        )}
                        selectedValue={props.formikProps.values[FormField.reasonNotSchool]}
                        setFieldValue={props.formikProps.setFieldValue}
                        setFieldTouched={props.formikProps.setFieldTouched}
                    />
                    <HelperText
                        style={styles.errorText}
                        type="error"
                        visible={!!props.formikProps.errors[FormField.reasonNotSchool]}
                    >
                        Reason is a required field
                    </HelperText>
                </View>
            )}

            <TextCheckBox
                field={FormField.beenSchool}
                value={props.formikProps.values[FormField.beenSchool]}
                label={fieldLabels[FormField.beenSchool]}
                setFieldValue={props.formikProps.setFieldValue}
            />

            <TextCheckBox
                field={FormField.wantSchool}
                value={props.formikProps.values[FormField.wantSchool]}
                label={fieldLabels[FormField.wantSchool]}
                setFieldValue={props.formikProps.setFieldValue}
            />
        </View>
    );
};

export default EducationForm;
