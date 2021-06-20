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

const SocialForm = (props: IFormProps) => {
    return (
        <View>
            <TextCheckBox
                field={FormField.feelValue}
                value={props.formikProps.values[FormField.feelValue]}
                label={fieldLabels[FormField.feelValue]}
                setFieldValue={props.formikProps.setFieldValue}
            />
            <View
                style={{
                    paddingRight: 130,
                }}
            >
                <TextCheckBox
                    field={FormField.feelIndependent}
                    value={props.formikProps.values[FormField.feelIndependent]}
                    label={fieldLabels[FormField.feelIndependent]}
                    setFieldValue={props.formikProps.setFieldValue}
                />
            </View>

            <TextCheckBox
                field={FormField.ableInSocial}
                value={props.formikProps.values[FormField.ableInSocial]}
                label={fieldLabels[FormField.ableInSocial]}
                setFieldValue={props.formikProps.setFieldValue}
            />
            <TextCheckBox
                field={FormField.disabiAffectSocial}
                value={props.formikProps.values[FormField.disabiAffectSocial]}
                label={fieldLabels[FormField.disabiAffectSocial]}
                setFieldValue={props.formikProps.setFieldValue}
            />

            <TextCheckBox
                field={FormField.disabiDiscrimination}
                value={props.formikProps.values[FormField.disabiDiscrimination]}
                label={fieldLabels[FormField.disabiDiscrimination]}
                setFieldValue={props.formikProps.setFieldValue}
            />
        </View>
    );
};

export default SocialForm;