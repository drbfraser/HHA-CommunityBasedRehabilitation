import * as React from "react";
import { Component, Dispatch, SetStateAction } from "react";
import { View, TextInput as NativeText } from "react-native";
import { Button, Modal, Portal, TextInput, Text } from "react-native-paper";
import { useState } from "react";
import useStyles from "./ClientRisk.styles";
import { IRisk, RiskType } from "@cbr/common";
import { Formik } from "formik";

export interface ClientRiskFormProps {
    riskData: IRisk;
}

export const ClientRiskForm = (props: ClientRiskFormProps) => {
    const styles = useStyles();
    const [showModal, setShowModal] = useState(false);
    return (
        <View style={styles.riskModalStyle}>
            <Button
                mode="contained"
                style={styles.modalUpdateButton}
                onPress={() => {
                    setShowModal(true);
                }}
            >
                Update
            </Button>
            <Formik
                initialValues={props.riskData}
                onSubmit={(values) => {
                    console.log(values);
                }}
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
                            <TextInput
                                style={styles.riskLevelTextStyle}
                                defaultValue={"Risk Level"}
                                textAlignVertical={"center"}
                                mode={"outlined"}
                            />
                            <TextInput
                                style={styles.riskTextStyle}
                                label={"Requirements"}
                                defaultValue={formikProps.values.requirement}
                                onChangeText={formikProps.handleChange("requirement")}
                                multiline={true}
                                textAlignVertical={"top"}
                                mode={"outlined"}
                            />
                            <TextInput
                                style={styles.riskTextStyle}
                                label={"Goals"}
                                defaultValue={formikProps.values.goal}
                                onChangeText={formikProps.handleChange("goal")}
                                placeholder={"Goals"}
                                multiline={true}
                                textAlignVertical={"top"}
                                mode={"outlined"}
                            />
                            <Button
                                mode={"contained"}
                                onPress={() => {
                                    formikProps.handleSubmit();
                                    setShowModal(false);
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
