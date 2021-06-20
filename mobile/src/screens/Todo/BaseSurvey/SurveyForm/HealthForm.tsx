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

type ButtonVisibility = {
    [key: string]: boolean | undefined;
};

const HealthForm = (props: IFormProps) => {
    const [visible, setVisible] = React.useState<ButtonVisibility>({});
    const _toggleDialog = (name: string) => () =>
        setVisible({ ...visible, [name]: !visible[name] });
    const _getVisible = (name: string) => !!visible[name];

    return (
        <View>
            <Text style={{ fontSize: 15 }}>Rate your general health {"\n"}</Text>

            <Button mode="contained" onPress={_toggleDialog("dialog2")}>
                Choose Health Rate
            </Button>
            <Text />
            <DialogWithRadioBtns
                visible={_getVisible("dialog2")}
                close={_toggleDialog("dialog2")}
            />
            <TextCheckBox
                field={FormField.getService}
                value={props.formikProps.values[FormField.getService]}
                label={fieldLabels[FormField.getService]}
                setFieldValue={props.formikProps.setFieldValue}
            />
            <TextCheckBox
                field={FormField.needService}
                value={props.formikProps.values[FormField.needService]}
                label={fieldLabels[FormField.needService]}
                setFieldValue={props.formikProps.setFieldValue}
            />

            <TextCheckBox
                field={FormField.haveDevice}
                value={props.formikProps.values[FormField.haveDevice]}
                label={fieldLabels[FormField.haveDevice]}
                setFieldValue={props.formikProps.setFieldValue}
            />

            <View
                style={{
                    paddingRight: 19,
                }}
            >
                <TextCheckBox
                    field={FormField.deviceWorking}
                    value={props.formikProps.values[FormField.deviceWorking]}
                    label={fieldLabels[FormField.deviceWorking]}
                    setFieldValue={props.formikProps.setFieldValue}
                />
            </View>

            <View
                style={{
                    paddingRight: 81,
                }}
            >
                <TextCheckBox
                    field={FormField.needDevice}
                    value={props.formikProps.values[FormField.needDevice]}
                    label={fieldLabels[FormField.needDevice]}
                    setFieldValue={props.formikProps.setFieldValue}
                />
            </View>

            {props.formikProps.values[FormField.needDevice] && (
                <View>
                    <Text style={{ fontSize: 15 }}>What assistive device do you need? {"\n"}</Text>
                    <Button mode="contained" onPress={_toggleDialog("dialog2")}>
                        Choose device type
                    </Button>
                    <DialogWithRadioBtns
                        visible={_getVisible("dialog3")}
                        close={_toggleDialog("dialog3")}
                    />
                </View>
            )}

            <Text />
            <Text style={{ fontSize: 15 }}>
                Are you satisfied with the health services you receive?{"\n"}
            </Text>

            <Button mode="contained" onPress={_toggleDialog("dialog2")}>
                Choose Satisfied Rate
            </Button>
            <DialogWithRadioBtns
                visible={_getVisible("dialog2")}
                close={_toggleDialog("dialog2")}
            />
        </View>
    );
};

export default HealthForm;
