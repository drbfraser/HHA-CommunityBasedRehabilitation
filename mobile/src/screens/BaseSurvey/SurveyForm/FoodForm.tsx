import React, { useState } from "react";
import { View } from "react-native";
import { Text, Button, Dialog, Portal, Paragraph, HelperText } from "react-native-paper";
import { fieldLabels, FormField, IFormProps } from "../formFields";
import { childNourish, rateLevel } from "@cbr/common";
import { Picker } from "@react-native-community/picker";
import useStyles from "../baseSurvey.style";
import TextCheckBox from "../../../components/TextCheckBox";

const FoodForm = (props: IFormProps) => {
    const [alertInfo, setAlertError] = useState(false);
    const styles = useStyles();
    const hideAlert = () => setAlertError(false);
    const showAlert = () => setAlertError(true);

    return (
        <View>
            <View
                style={{
                    paddingRight: 50,
                }}
            >
                <Text style={styles.pickerQuestion}>Food security</Text>
                <Picker
                    selectedValue={props.formikProps.values[FormField.foodSecurityRate]}
                    style={styles.picker}
                    onValueChange={(itemValue) => {
                        props.formikProps.setFieldTouched(FormField.foodSecurityRate, true);
                        props.formikProps.setFieldValue(FormField.foodSecurityRate, itemValue);
                    }}
                >
                    <Picker.Item key={"unselectable"} label={""} value={""} />
                    {Object.entries(rateLevel).map(([value, { name }]) => (
                        <Picker.Item label={name} value={value} key={value} />
                    ))}
                </Picker>

                <HelperText
                    style={styles.errorText}
                    type="error"
                    visible={
                        props.formikProps.values[FormField.foodSecurityRate] === "" ||
                        props.formikProps.touched[FormField.foodSecurityRate] !== true
                    }
                >
                    {props.formikProps.errors[FormField.foodSecurityRate]}
                </HelperText>
                <TextCheckBox
                    field={FormField.enoughFoodPerMonth}
                    value={props.formikProps.values[FormField.enoughFoodPerMonth]}
                    label={fieldLabels[FormField.enoughFoodPerMonth]}
                    setFieldValue={props.formikProps.setFieldValue}
                />
            </View>

            <View
                style={{
                    paddingRight: 100,
                }}
            >
                <TextCheckBox
                    field={FormField.isChild}
                    value={props.formikProps.values[FormField.isChild]}
                    label={fieldLabels[FormField.isChild]}
                    setFieldValue={props.formikProps.setFieldValue}
                />
            </View>
            {props.formikProps.values[FormField.isChild] && (
                <View
                    style={{
                        paddingLeft: 30,
                    }}
                >
                    <Text style={styles.pickerQuestion}>
                        What is this child nutritional status?
                    </Text>
                    <Picker
                        selectedValue={props.formikProps.values[FormField.childNourish]}
                        style={styles.picker}
                        onValueChange={(itemValue) => {
                            props.formikProps.setFieldTouched(FormField.childNourish, true);
                            props.formikProps.setFieldValue(FormField.childNourish, itemValue);
                            itemValue === "M" ? showAlert() : hideAlert();
                        }}
                    >
                        <Picker.Item key={"unselectable"} label={""} value={""} />
                        {Object.entries(childNourish).map(([value, name]) => (
                            <Picker.Item label={name} value={value} key={value} />
                        ))}
                    </Picker>

                    <HelperText
                        style={styles.errorText}
                        type="error"
                        visible={props.formikProps.values[FormField.childNourish] === ""}
                    >
                        {props.formikProps.errors[FormField.childNourish]}
                    </HelperText>

                    {props.formikProps.values[FormField.childNourish] === "M" && (
                        <View>
                            <Portal>
                                <Dialog visible={alertInfo} onDismiss={showAlert}>
                                    <Dialog.Title>Reminder</Dialog.Title>
                                    <Dialog.Content>
                                        <Paragraph>
                                            A referral to the health center is required!
                                        </Paragraph>
                                    </Dialog.Content>
                                    <Dialog.Actions>
                                        <Button onPress={hideAlert}>OK</Button>
                                    </Dialog.Actions>
                                </Dialog>
                            </Portal>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

export default FoodForm;
