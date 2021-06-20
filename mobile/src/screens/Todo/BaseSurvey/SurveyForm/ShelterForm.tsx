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

const ShelterForm = (props: IFormProps) => {
    return (
        <View>
            <View
                style={{
                    paddingRight: 100,
                }}
            >
                <TextCheckBox
                    field={FormField.haveShelter}
                    value={props.formikProps.values[FormField.haveShelter]}
                    label={fieldLabels[FormField.haveShelter]}
                    setFieldValue={props.formikProps.setFieldValue}
                />
            </View>

            <View
                style={{
                    paddingRight: 100,
                }}
            >
                <TextCheckBox
                    field={FormField.accessItem}
                    value={props.formikProps.values[FormField.accessItem]}
                    label={fieldLabels[FormField.accessItem]}
                    setFieldValue={props.formikProps.setFieldValue}
                />
            </View>
        </View>
    );
};

export default ShelterForm;
{
    /* <TextInput
                mode="outlined"
                // style={styles.inputContainerStyle}
                label="Outlined input multiline"
                multiline
                placeholder="Type something"
                value={FormField.organization}
                onChangeText={() =>
                    props.formikProps.setFieldValue(
                        FormField.organization,
                        props.formikProps.values.organization
                    )
                }
            /> */
}
