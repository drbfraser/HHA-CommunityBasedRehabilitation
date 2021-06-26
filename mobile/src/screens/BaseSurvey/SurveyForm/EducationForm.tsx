import React from "react";
import { View } from "react-native";
import { HelperText, Text } from "react-native-paper";
import { fieldLabels, FormField, IFormProps } from "../formFields";
import { grade, reasonNotSchool } from "@cbr/common";
import { Picker } from "@react-native-community/picker";
import useStyles from "../baseSurvey.style";
import TextCheckBox from "../../../components/TextCheckBox";

const EducationForm = (props: IFormProps) => {
    const styles = useStyles();

    return (
        <View>
            <View
                style={{
                    paddingRight: 150,
                }}
            >
                <TextCheckBox
                    field={FormField.goSchool}
                    value={props.formikProps.values[FormField.goSchool]}
                    label={fieldLabels[FormField.goSchool]}
                    setFieldValue={props.formikProps.setFieldValue}
                />
            </View>

            {props.formikProps.values[FormField.goSchool] ? (
                <View>
                    <Text style={styles.pickerQuestion}>What grade?</Text>
                    <Picker
                        selectedValue={props.formikProps.values[FormField.grade]}
                        style={styles.picker}
                        onValueChange={(itemValue) => {
                            props.formikProps.setFieldValue(FormField.grade, itemValue);
                            props.formikProps.setFieldTouched(FormField.grade, true);
                        }}
                    >
                        <Picker.Item key={"unselectable"} label={""} value={""} />
                        {Object.entries(grade).map(([value, { name }]) => (
                            <Picker.Item label={name} value={value} key={name} />
                        ))}
                    </Picker>
                    <HelperText
                        style={styles.errorText}
                        type="error"
                        visible={props.formikProps.values[FormField.grade] === ""}
                    >
                        {props.formikProps.errors[FormField.grade]}
                    </HelperText>
                </View>
            ) : (
                <View>
                    <Text style={styles.pickerQuestion}>Why do you not go to school?</Text>
                    <Picker
                        selectedValue={props.formikProps.values[FormField.reasonNotSchool]}
                        style={styles.picker}
                        onValueChange={(itemValue) => {
                            props.formikProps.setFieldTouched(FormField.reasonNotSchool, true);
                            props.formikProps.setFieldValue(FormField.reasonNotSchool, itemValue);
                        }}
                    >
                        <Picker.Item key={"unselectable"} label={""} value={""} />
                        {Object.entries(reasonNotSchool).map(([value, name]) => (
                            <Picker.Item label={name} value={value} key={name} />
                        ))}
                    </Picker>
                    <HelperText
                        style={styles.errorText}
                        type="error"
                        visible={props.formikProps.values[FormField.reasonNotSchool] === ""}
                    >
                        Reason is a required field
                    </HelperText>
                </View>
            )}

            <View
                style={{
                    paddingRight: 55,
                }}
            >
                <TextCheckBox
                    field={FormField.beenSchool}
                    value={props.formikProps.values[FormField.beenSchool]}
                    label={fieldLabels[FormField.beenSchool]}
                    setFieldValue={props.formikProps.setFieldValue}
                />
            </View>
            <View
                style={{
                    paddingRight: 100,
                }}
            >
                <TextCheckBox
                    field={FormField.wantSchool}
                    value={props.formikProps.values[FormField.wantSchool]}
                    label={fieldLabels[FormField.wantSchool]}
                    setFieldValue={props.formikProps.setFieldValue}
                />
            </View>
        </View>
    );
};

export default EducationForm;
