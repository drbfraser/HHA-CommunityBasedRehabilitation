import React, { useState } from "react";
import { View } from "react-native";
import { Text, Button, Dialog, Portal, Paragraph, HelperText } from "react-native-paper";
import {
    baseFieldLabels,
    BaseSurveyFormField,
    IFormProps,
    childNourish,
    rateLevel,
} from "@cbr/common";
import useStyles from "../baseSurvey.style";
import TextCheckBox from "../../../components/TextCheckBox/TextCheckBox";
import TextPicker, { IPickerChoice } from "../../../components/TextPicker/TextPicker";
import { Picker } from "@react-native-picker/picker";

const FoodForm = (props: IFormProps) => {
    const [alertInfo, setAlertError] = useState(false);
    const styles = useStyles();
    const hideAlert = () => setAlertError(false);
    const showAlert = () => setAlertError(true);

    return (
        <View>
            <Text style={styles.pickerQuestion}>Food security</Text>
            <TextPicker
                field={BaseSurveyFormField.foodSecurityRate}
                choices={Object.entries(rateLevel).map(
                    (key) =>
                        ({
                            value: key[0],
                            label: key[1].name,
                        } as IPickerChoice)
                )}
                selectedValue={props.formikProps.values[BaseSurveyFormField.foodSecurityRate]}
                setFieldValue={props.formikProps.setFieldValue}
                setFieldTouched={props.formikProps.setFieldTouched}
            />

            <HelperText
                style={styles.errorText}
                type="error"
                visible={!!props.formikProps.errors[BaseSurveyFormField.foodSecurityRate]}
            >
                {props.formikProps.errors[BaseSurveyFormField.foodSecurityRate]}
            </HelperText>
            <TextCheckBox
                field={BaseSurveyFormField.enoughFoodPerMonth}
                value={props.formikProps.values[BaseSurveyFormField.enoughFoodPerMonth]}
                label={baseFieldLabels[BaseSurveyFormField.enoughFoodPerMonth]}
                setFieldValue={props.formikProps.setFieldValue}
            />
            <TextCheckBox
                field={BaseSurveyFormField.isChild}
                value={props.formikProps.values[BaseSurveyFormField.isChild]}
                label={baseFieldLabels[BaseSurveyFormField.isChild]}
                setFieldValue={props.formikProps.setFieldValue}
            />
            {props.formikProps.values[BaseSurveyFormField.isChild] && (
                <View>
                    <Text style={styles.pickerQuestion}>
                        What is this child nutritional status?
                    </Text>

                    <Picker
                        selectedValue={props.formikProps.values[BaseSurveyFormField.childNourish]}
                        style={styles.picker}
                        onValueChange={(itemValue) => {
                            props.formikProps.setFieldTouched(
                                BaseSurveyFormField.childNourish,
                                true
                            );
                            props.formikProps.setFieldValue(
                                BaseSurveyFormField.childNourish,
                                itemValue
                            );
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
                        visible={!!props.formikProps.errors[BaseSurveyFormField.childNourish]}
                    >
                        {props.formikProps.errors[BaseSurveyFormField.childNourish]}
                    </HelperText>

                    {props.formikProps.values[BaseSurveyFormField.childNourish] === "M" && (
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
