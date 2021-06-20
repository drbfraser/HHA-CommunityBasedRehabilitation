import React, { useRef, useState } from "react";
import { Alert, SafeAreaView, ScrollView, TouchableOpacity, View } from "react-native";
import {
    Text,
    Title,
    Button,
    Checkbox,
    Dialog,
    Portal,
    Paragraph,
    Appbar,
    Menu,
    TextInput,
    TouchableRipple,
} from "react-native-paper";
import {
    educationValidationSchema,
    empowermentValidationSchema,
    emptyValidationSchema,
    fieldLabels,
    foodValidationSchema,
    FormField,
    healthValidationSchema,
    IFormProps,
    initialValues,
    livelihoodValidationSchema,
} from "../formFields";
import { Field, Form, Formik, FormikHelpers, FormikProps } from "formik";
import { useHistory, useParams } from "react-router-dom";
import { handleSubmit } from "../formHandler";
import { MaterialIcons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import { themeColors } from "@cbr/common";
import { Picker } from "@react-native-community/picker";
// import Checkbox from "@react-native-community/checkbox";
import useStyles, { defaultScrollViewProps, progressStepsStyle } from "../baseSurvey.style";
import DialogWithRadioBtns from "../../../../util/DialogWithRadioBtn";
import TextCheckBox from "../../../../util/TextCheckBox";

const FoodForm = (props: IFormProps) => {
    const [submissionError, setSubmissionError] = useState(false);
    const hideAlert = () => setSubmissionError(false);
    const showAlert = () => setSubmissionError(true);
    const styles = useStyles();

    return (
        <View>
            <View
                style={{
                    paddingRight: 50,
                }}
            >
                <Text>Food security</Text>
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
                    <Text>What is this child nutritional status?</Text>
                    <TouchableOpacity
                        style={[styles.centerElement, { width: 50, height: 50 }]}
                        onPress={() => {}}
                    ></TouchableOpacity>
                    <Portal>
                        <Dialog visible={submissionError} onDismiss={showAlert}>
                            <Dialog.Title>Error</Dialog.Title>
                            <Dialog.Content>
                                <Paragraph>A referral to the health center is required!</Paragraph>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={hideAlert}>OK</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                    <Button onPress={showAlert} mode="contained">
                        Show Dialog
                    </Button>
                </View>
            )}
        </View>
    );
};

export default FoodForm;
