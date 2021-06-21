import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { fieldLabels, FormField, IFormProps } from "../formFields";
import { deviceTypes, rateLevel } from "@cbr/common";
import { Picker } from "@react-native-community/picker";
import useStyles from "../baseSurvey.style";
import TextCheckBox from "../../../../util/TextCheckBox";

const HealthForm = (props: IFormProps) => {
    const styles = useStyles();

    return (
        <View>
            <Text style={styles.pickerQuestion}>{"\n"}Rate your general health </Text>

            <Picker
                selectedValue={props.formikProps.values[FormField.rateLevel]}
                style={styles.picker}
                onValueChange={(itemValue) =>
                    props.formikProps.setFieldValue(FormField.rateLevel, itemValue)
                }
            >
                {Object.entries(rateLevel).map(([value, { name }]) => (
                    <Picker.Item label={name} value={value} />
                ))}
            </Picker>

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
                        onValueChange={(itemValue) =>
                            props.formikProps.setFieldValue(FormField.deviceType, itemValue)
                        }
                    >
                        {Object.entries(deviceTypes).map(([value, name]) => (
                            <Picker.Item label={name} value={value} />
                        ))}
                    </Picker>
                </View>
            )}

            <Text style={styles.pickerQuestion}>
                {"\n"}Are you satisfied with the health services you receive?
            </Text>
            <Picker
                selectedValue={props.formikProps.values[FormField.serviceSatisf]}
                style={styles.picker}
                onValueChange={(itemValue) =>
                    props.formikProps.setFieldValue(FormField.serviceSatisf, itemValue)
                }
            >
                {Object.entries(rateLevel).map(([value, { name }]) => (
                    <Picker.Item label={name} value={value} />
                ))}
            </Picker>
        </View>
    );
};

export default HealthForm;
