import React, { useState } from "react";
import { View } from "react-native";
import { Text, Button, Dialog, Portal, Paragraph, HelperText } from "react-native-paper";
import { fieldLabels, FormField, IFormProps } from "../formFields";
import { childNourish, rateLevel } from "@cbr/common";
import { Picker } from "@react-native-community/picker";
import useStyles from "../baseSurvey.style";
import TextCheckBox from "../../../../util/TextCheckBox";

const FoodForm = (props: IFormProps) => {
    const [alertError, setAlertError] = useState(false);
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
                    onValueChange={(itemValue) =>
                        props.formikProps.setFieldValue(FormField.foodSecurityRate, itemValue)
                    }
                >
                    {Object.entries(rateLevel).map(([value, { name }]) => (
                        <Picker.Item label={name} value={value} />
                    ))}
                </Picker>
                <HelperText
                    type="error"
                    visible={props.formikProps.values[FormField.foodSecurityRate] === ""}
                >
                    Please choose an item!!
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
                            props.formikProps.setFieldValue(FormField.childNourish, itemValue);
                            itemValue === "M" ? showAlert() : hideAlert();
                        }}
                    >
                        {Object.entries(childNourish).map(([value, name]) => (
                            <Picker.Item label={name} value={value} />
                        ))}
                    </Picker>
                    <HelperText
                        type="error"
                        visible={props.formikProps.values[FormField.childNourish] === ""}
                    >
                        Please choose an item!!
                    </HelperText>

                    {props.formikProps.values[FormField.childNourish] === "M" && (
                        <View>
                            <Portal>
                                <Dialog visible={alertError} onDismiss={showAlert}>
                                    <Dialog.Title>Error</Dialog.Title>
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
