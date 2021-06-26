import React from "react";
import { View } from "react-native";
import { HelperText, Text } from "react-native-paper";
import { fieldLabels, FormField, IFormProps } from "../formFields";
import { deviceTypes, rateLevel } from "@cbr/common";
import { Picker } from "@react-native-community/picker";
import useStyles from "../baseSurvey.style";
import TextCheckBox from "../../../components/TextCheckBox";

const HealthForm = (props: IFormProps) => {
    const styles = useStyles();

    return (
        <View>
            <Text style={styles.pickerQuestion}>{"\n"}Rate your general health </Text>

            <Picker
                selectedValue={props.formikProps.values[FormField.rateLevel]}
                style={styles.picker}
                onValueChange={(itemValue) => {
                    props.formikProps.setFieldTouched(FormField.rateLevel, true);
                    props.formikProps.setFieldValue(FormField.rateLevel, itemValue);
                }}
            >
                <Picker.Item key={"unselectable"} label={""} value={""} />
                {Object.entries(rateLevel).map(([value, { name }]) => (
                    <Picker.Item label={name} value={value} key={name} />
                ))}
            </Picker>
            <HelperText
                style={styles.errorText}
                type="error"
                visible={
                    props.formikProps.values[FormField.rateLevel] === "" ||
                    props.formikProps.touched[FormField.rateLevel] !== true
                }
            >
                {props.formikProps.errors[FormField.rateLevel]}
            </HelperText>

            <TextCheckBox
                field={FormField.getService}
                value={props.formikProps.values[FormField.getService]}
                label={fieldLabels[FormField.getService]}
                setFieldValue={props.formikProps.setFieldValue}
            />
            <TextCheckBox
                field={FormField.needService}
                value={props.formikProps.values[FormField.needService]}
                label={fieldLabels[FormField.needService]}
                setFieldValue={props.formikProps.setFieldValue}
            />
            <TextCheckBox
                field={FormField.haveDevice}
                value={props.formikProps.values[FormField.haveDevice]}
                label={fieldLabels[FormField.haveDevice]}
                setFieldValue={props.formikProps.setFieldValue}
            />
            <View
                style={{
                    paddingRight: 19,
                }}
            >
                <TextCheckBox
                    field={FormField.deviceWorking}
                    value={props.formikProps.values[FormField.deviceWorking]}
                    label={fieldLabels[FormField.deviceWorking]}
                    setFieldValue={props.formikProps.setFieldValue}
                />
            </View>
            <View
                style={{
                    paddingRight: 81,
                }}
            >
                <TextCheckBox
                    field={FormField.needDevice}
                    value={props.formikProps.values[FormField.needDevice]}
                    label={fieldLabels[FormField.needDevice]}
                    setFieldValue={props.formikProps.setFieldValue}
                />
            </View>
            {props.formikProps.values[FormField.needDevice] && (
                <View>
                    <Text style={styles.pickerQuestion}>
                        {"\n"} What assistive device do you need?
                    </Text>
                    <Picker
                        selectedValue={props.formikProps.values[FormField.deviceType]}
                        style={styles.picker}
                        onValueChange={(itemValue) => {
                            props.formikProps.setFieldTouched(FormField.deviceType, true);
                            props.formikProps.setFieldValue(FormField.deviceType, itemValue);
                        }}
                    >
                        <Picker.Item key={"unselectable"} label={""} value={""} />
                        {Object.entries(deviceTypes).map(([value, name]) => (
                            <Picker.Item label={name} value={value} key={name} />
                        ))}
                    </Picker>

                    <HelperText
                        style={styles.errorText}
                        type="error"
                        visible={props.formikProps.values[FormField.deviceType] === ""}
                    >
                        {props.formikProps.errors[FormField.deviceType]}
                    </HelperText>
                </View>
            )}
            <Text style={styles.pickerQuestion}>
                {"\n"}Are you satisfied with the health services you receive?
            </Text>

            <Picker
                selectedValue={props.formikProps.values[FormField.serviceSatisf]}
                style={styles.picker}
                onValueChange={(itemValue) => {
                    props.formikProps.setFieldTouched(FormField.serviceSatisf, true);
                    props.formikProps.setFieldValue(FormField.serviceSatisf, itemValue);
                }}
            >
                <Picker.Item key={"unselectable"} label={""} value={""} />
                {Object.entries(rateLevel).map(([value, { name }]) => (
                    <Picker.Item label={name} value={value} key={name} />
                ))}
            </Picker>
            <HelperText
                style={styles.errorText}
                type="error"
                visible={
                    props.formikProps.values[FormField.serviceSatisf] === "" ||
                    props.formikProps.touched[FormField.serviceSatisf] !== true
                }
            >
                {props.formikProps.errors[FormField.serviceSatisf]}
            </HelperText>
        </View>
    );
};

export default HealthForm;
