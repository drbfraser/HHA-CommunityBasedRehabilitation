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

const EmpowermentForm = (props: IFormProps) => {
    return (
        <View>
            <TextCheckBox
                field={FormField.memOfOrgan}
                value={props.formikProps.values[FormField.memOfOrgan]}
                label={fieldLabels[FormField.memOfOrgan]}
                setFieldValue={props.formikProps.setFieldValue}
            />
            {props.formikProps.values[FormField.memOfOrgan] && (
                <TextInput
                    mode="outlined"
                    label={FormField.organization}
                    onChangeText={(value) =>
                        props.formikProps.setFieldValue(FormField.organization, value)
                    }
                />
            )}

            <TextCheckBox
                field={FormField.awareRight}
                value={props.formikProps.values[FormField.awareRight]}
                label={fieldLabels[FormField.awareRight]}
                setFieldValue={props.formikProps.setFieldValue}
            />

            <TextCheckBox
                field={FormField.ableInfluence}
                value={props.formikProps.values[FormField.ableInfluence]}
                label={fieldLabels[FormField.ableInfluence]}
                setFieldValue={props.formikProps.setFieldValue}
            />
        </View>
    );
};

export default EmpowermentForm;
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
