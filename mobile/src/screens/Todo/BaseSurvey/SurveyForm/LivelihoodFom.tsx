import React from "react";
import { View } from "react-native";
import { HelperText, Text, TextInput } from "react-native-paper";
import { fieldLabels, FormField, IFormProps } from "../formFields";
import { isSelfEmployed } from "@cbr/common";
import { Picker } from "@react-native-community/picker";
import useStyles from "../baseSurvey.style";
import TextCheckBox from "../../../../util/TextCheckBox";

const LivelihoodForm = (props: IFormProps) => {
    const styles = useStyles();

    return (
        <View>
            <View
                style={{
                    paddingRight: 160,
                }}
            >
                <TextCheckBox
                    field={FormField.isWorking}
                    value={props.formikProps.values[FormField.isWorking]}
                    label={fieldLabels[FormField.isWorking]}
                    setFieldValue={props.formikProps.setFieldValue}
                />
            </View>
            {props.formikProps.values[FormField.isWorking] && (
                <View
                    style={{
                        paddingLeft: 30,
                    }}
                >
                    <Text style={styles.pickerQuestion}>What do you do?</Text>
                    <TextInput
                        mode="outlined"
                        label={FormField.job}
                        onChangeText={(value) =>
                            props.formikProps.setFieldValue(FormField.job, value)
                        }
                    />
                    <HelperText
                        type="error"
                        visible={props.formikProps.values[FormField.job] === ""}
                    >
                        Please choose an item!!
                    </HelperText>
                    <View>
                        <Text />
                        <Text style={styles.pickerQuestion}>
                            Are you employed or self-employed?
                        </Text>
                        <Picker
                            selectedValue={props.formikProps.values[FormField.isSelfEmployed]}
                            style={styles.picker}
                            onValueChange={(itemValue) =>
                                props.formikProps.setFieldValue(FormField.isSelfEmployed, itemValue)
                            }
                        >
                            {Object.entries(isSelfEmployed).map(([value, name]) => (
                                <Picker.Item label={name} value={value} />
                            ))}
                        </Picker>
                        <HelperText
                            type="error"
                            visible={props.formikProps.values[FormField.isSelfEmployed] === ""}
                        >
                            Please choose an item!!
                        </HelperText>
                    </View>
                </View>
            )}

            <View
                style={{
                    paddingRight: 50,
                }}
            >
                <TextCheckBox
                    field={FormField.meetFinanceNeeds}
                    value={props.formikProps.values[FormField.meetFinanceNeeds]}
                    label={fieldLabels[FormField.meetFinanceNeeds]}
                    setFieldValue={props.formikProps.setFieldValue}
                />
            </View>
            <TextCheckBox
                field={FormField.disabiAffectWork}
                value={props.formikProps.values[FormField.disabiAffectWork]}
                label={fieldLabels[FormField.disabiAffectWork]}
                setFieldValue={props.formikProps.setFieldValue}
            />
            <View
                style={{
                    paddingRight: 160,
                }}
            >
                <TextCheckBox
                    field={FormField.wantWork}
                    value={props.formikProps.values[FormField.wantWork]}
                    label={fieldLabels[FormField.wantWork]}
                    setFieldValue={props.formikProps.setFieldValue}
                />
            </View>
        </View>
    );
};

export default LivelihoodForm;
