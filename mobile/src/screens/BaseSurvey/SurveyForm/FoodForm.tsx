import React, { useState } from "react";
import { View } from "react-native";
import { Button, Dialog, Paragraph, Portal, Text } from "react-native-paper";
import {
    baseFieldLabels,
    BaseSurveyFormField,
    childNourish,
    IFormProps,
    rateLevel,
} from "@cbr/common";
import useStyles from "../baseSurvey.style";
import TextCheckBox from "../../../components/TextCheckBox/TextCheckBox";
import FormikExposedDropdownMenu from "../../../components/ExposedDropdownMenu/FormikExposedDropdownMenu";

const FoodForm = (props: IFormProps) => {
    const [alertInfo, setAlertError] = useState(false);
    const styles = useStyles();
    const hideAlert = () => setAlertError(false);
    const showAlert = () => setAlertError(true);

    return (
        <View>
            <Text style={styles.pickerQuestion}>Food security</Text>
            <FormikExposedDropdownMenu
                field={BaseSurveyFormField.foodSecurityRate}
                valuesType="record-string"
                values={Object.entries(rateLevel).reduce((accumulator, [value, { name }]) => {
                    accumulator[value] = name;
                    return accumulator;
                }, {})}
                formikProps={props.formikProps}
                fieldLabels={baseFieldLabels}
                mode="outlined"
            />
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

                    <FormikExposedDropdownMenu
                        field={BaseSurveyFormField.childNourish}
                        valuesType="record-string"
                        values={childNourish}
                        formikProps={props.formikProps}
                        otherOnKeyChange={(key) => (key === "M" ? showAlert() : hideAlert())}
                        fieldLabels={baseFieldLabels}
                        mode="outlined"
                    />

                    <Portal>
                        <Dialog visible={alertInfo} onDismiss={hideAlert}>
                            <Dialog.Title>Reminder</Dialog.Title>
                            <Dialog.Content>
                                <Paragraph>A referral to the health center is required!</Paragraph>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={hideAlert}>OK</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                </View>
            )}
        </View>
    );
};

export default FoodForm;
