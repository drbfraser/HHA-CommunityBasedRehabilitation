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
import useStyles, { defaultScrollViewProps, progressStepsStyle } from "../baseSurvey.style";
import DialogWithRadioBtns from "../../../../util/DialogWithRadioBtn";
import TextCheckBox from "../../../../util/TextCheckBox";

const EducationForm = (props: IFormProps) => {
    return (
        <View>
            <View
                style={{
                    paddingRight: 150,
                }}
            >
                <TextCheckBox
                    field={FormField.goSchool}
                    value={props.formikProps.values[FormField.goSchool]}
                    label={fieldLabels[FormField.goSchool]}
                    setFieldValue={props.formikProps.setFieldValue}
                />
            </View>
            <View
                style={{
                    paddingLeft: 30,
                }}
            >
                <Text>Why do you not go to school?</Text>
                <Text>What grade?</Text>
            </View>
            <View
                style={{
                    paddingRight: 55,
                }}
            >
                <TextCheckBox
                    field={FormField.beenSchool}
                    value={props.formikProps.values[FormField.beenSchool]}
                    label={fieldLabels[FormField.beenSchool]}
                    setFieldValue={props.formikProps.setFieldValue}
                />
            </View>
            <View
                style={{
                    paddingRight: 100,
                }}
            >
                <TextCheckBox
                    field={FormField.wantSchool}
                    value={props.formikProps.values[FormField.wantSchool]}
                    label={fieldLabels[FormField.wantSchool]}
                    setFieldValue={props.formikProps.setFieldValue}
                />
            </View>
        </View>
    );
};

export default EducationForm;
