import * as React from "react";
import { Component, Dispatch, SetStateAction, useContext } from "react";
import { View, TextInput as NativeText, Platform, ToastAndroid, AlertIOS } from "react-native";
import { Button, Modal, Portal, TextInput, Text, Menu, RadioButton } from "react-native-paper";
import { useState } from "react";
import useStyles, { riskStyles } from "./ClientRisk.styles";
import {
    fieldLabels,
    FormField,
    IRisk,
    RiskLevel,
    riskLevels,
    RiskType,
    validationSchema,
} from "@cbr/common";
import { Formik } from "formik";
import { handleRiskSubmit } from "./ClientRiskFormHandler";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import { SyncContext } from "../../../context/SyncContext/SyncContext";

export interface ClientRiskFormProps {
    riskData: any;
    setRisk: (risk: any) => void;
    clientArchived: boolean;
}

export const toastValidationError = () => {
    const msg = "Please check one or more fields.";
    if (Platform.OS === "android") {
        ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
        AlertIOS.alert(msg);
    }
};

export const ClientRiskForm = (props: ClientRiskFormProps) => {
    const styles = useStyles();
    const [showModal, setShowModal] = useState(false);
    const database = useDatabase();
    const { autoSync, cellularSync } = useContext(SyncContext);

    const getRiskFormInitialValues = () => {
        const risk = props.riskData;
        const riskFormProps: IRisk = {
            id: risk.id,
            client_id: risk.client.id,
            timestamp: risk.timestamp,
            risk_type: risk.risk_type,
            risk_level: risk.risk_level,
            requirement: risk.requirement,
            goal: risk.goal,
        };
        return riskFormProps;
    };

    return (
        <View style={styles.riskModalStyle}>
            <Button
                mode="contained"
                style={styles.modalUpdateButton}
                disabled={!props.clientArchived}
                onPress={() => {
                    setShowModal(true);
                }}
            >
                Update
            </Button>
            <Formik
                initialValues={getRiskFormInitialValues()}
                onSubmit={(values) => {
                    handleRiskSubmit(
                        values,
                        props.riskData,
                        props.setRisk,
                        database,
                        autoSync,
                        cellularSync
                    );
                }}
                validationSchema={validationSchema}
            >
                {(formikProps) => (
                    <Portal>
                        <Modal
                            visible={showModal}
                            style={styles.modalStyle}
                            onDismiss={() => {
                                setShowModal(false);
                                formikProps.resetForm();
                            }}
                        >
                            {formikProps.values.risk_type === RiskType.HEALTH ? (
                                <Text style={styles.riskHeaderStyle}>Update Health Risk</Text>
                            ) : (
                                <></>
                            )}
                            {formikProps.values.risk_type === RiskType.EDUCATION ? (
                                <Text style={styles.riskHeaderStyle}>Update Education Risk</Text>
                            ) : (
                                <></>
                            )}
                            {formikProps.values.risk_type === RiskType.SOCIAL ? (
                                <Text style={styles.riskHeaderStyle}>Update Social Risk</Text>
                            ) : (
                                <></>
                            )}
                            {formikProps.values.risk_type === RiskType.NUTRITION ? (
                                <Text style={styles.riskHeaderStyle}>Update Nutrition Risk</Text>
                            ) : (
                                <></>
                            )}
                            <RadioButton.Group
                                onValueChange={(newValue) =>
                                    formikProps.setFieldValue(FormField.risk_level, newValue)
                                }
                                value={formikProps.values.risk_level}
                            >
                                <View style={styles.menuField}>
                                    <View style={styles.radioIndividual}>
                                        <Text
                                            style={
                                                riskStyles(riskLevels[RiskLevel.LOW].color)
                                                    .riskRadioStyle
                                            }
                                        >
                                            {RiskLevel.LOW}
                                        </Text>
                                        <RadioButton value={RiskLevel.LOW} />
                                    </View>
                                    <View style={styles.radioIndividual}>
                                        <Text
                                            style={
                                                riskStyles(riskLevels[RiskLevel.MEDIUM].color)
                                                    .riskRadioStyle
                                            }
                                        >
                                            {RiskLevel.MEDIUM}
                                        </Text>
                                        <RadioButton value={RiskLevel.MEDIUM} />
                                    </View>
                                    <View style={styles.radioIndividual}>
                                        <Text
                                            style={
                                                riskStyles(riskLevels[RiskLevel.HIGH].color)
                                                    .riskRadioStyle
                                            }
                                        >
                                            {RiskLevel.HIGH}
                                        </Text>
                                        <RadioButton value={RiskLevel.HIGH} />
                                    </View>
                                    <View style={styles.radioIndividual}>
                                        <Text
                                            style={
                                                riskStyles(riskLevels[RiskLevel.CRITICAL].color)
                                                    .riskRadioStyle
                                            }
                                        >
                                            {RiskLevel.CRITICAL}
                                        </Text>
                                        <RadioButton value={RiskLevel.CRITICAL} />
                                    </View>
                                </View>
                            </RadioButton.Group>

                            <TextInput
                                style={styles.riskTextStyle}
                                label={fieldLabels[FormField.requirement]}
                                defaultValue={formikProps.values.requirement}
                                onChangeText={formikProps.handleChange(FormField.requirement)}
                                multiline={true}
                                textAlignVertical={"top"}
                                mode={"outlined"}
                            />
                            <Text style={styles.formikErrorStyle}>
                                {formikProps.errors.requirement}
                            </Text>
                            <TextInput
                                style={styles.riskTextStyle}
                                label={fieldLabels[FormField.goal]}
                                defaultValue={formikProps.values.goal}
                                onChangeText={formikProps.handleChange(FormField.goal)}
                                placeholder={FormField.goal}
                                multiline={true}
                                textAlignVertical={"top"}
                                mode={"outlined"}
                            />
                            <Text style={styles.formikErrorStyle}>{formikProps.errors.goal}</Text>
                            <Button
                                mode={"contained"}
                                style={styles.submitButtonStyle}
                                onPress={() => {
                                    if (formikProps.isValid) {
                                        formikProps.handleSubmit();
                                        setShowModal(false);
                                    } else {
                                        toastValidationError();
                                    }
                                }}
                            >
                                Save
                            </Button>
                        </Modal>
                    </Portal>
                )}
            </Formik>
        </View>
    );
};
