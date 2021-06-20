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

const LivelihoodForm = (props: IFormProps) => {
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
                    <Text>What do you do?</Text>
                    <TextInput
                        mode="outlined"
                        label={FormField.job}
                        onChangeText={(value) =>
                            props.formikProps.setFieldValue(FormField.job, value)
                        }
                    />
                    <Text>Are you employed or self-employed?</Text>
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
