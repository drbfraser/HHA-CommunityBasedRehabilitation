import * as React from "react";
import { Component, Dispatch, SetStateAction } from "react";
import { View, TextInput as NativeText } from "react-native";
import { Button, Modal, Portal, TextInput, Text } from "react-native-paper";
import { useState } from "react";
import useStyles from "./ClientRisk.styles";
import { IRisk, RiskType } from "@cbr/common";
import { FormikProps } from "formik";

export interface ClientRiskFormProps {
    formikProps: FormikProps<IRisk>;
    closeModal: void;
}

export const ClientRiskForm = (props: ClientRiskFormProps) => {
    const styles = useStyles();
    return (
        <View style={styles.riskModalStyle}>
            {props.formikProps.values.risk_type === RiskType.HEALTH ? (
                <Text style={styles.riskHeaderStyle}>Update Health Risk</Text>
            ) : (
                <></>
            )}
            {props.formikProps.values.risk_type === RiskType.EDUCATION ? (
                <Text style={styles.riskHeaderStyle}>Update Education Risk</Text>
            ) : (
                <></>
            )}
            {props.formikProps.values.risk_type === RiskType.SOCIAL ? (
                <Text style={styles.riskHeaderStyle}>Update Social Risk</Text>
            ) : (
                <></>
            )}
            <NativeText
                style={styles.riskLevelTextStyle}
                placeholder={"I need to be a picker LOL"}
                textAlignVertical={"center"}
            />
            <NativeText
                style={styles.riskTextStyle}
                placeholder={"Requirements"}
                defaultValue={props.formikProps.values.requirement}
                onChange={() => {
                    props.formikProps.handleChange("requirement");
                }}
                multiline={true}
                numberOfLines={5}
                textAlignVertical={"top"}
            />
            <NativeText
                style={styles.riskTextStyle}
                defaultValue={props.formikProps.values.goal}
                onChange={() => {
                    props.formikProps.handleChange("goal");
                }}
                placeholder={"Goals"}
                textAlignVertical={"top"}
            />
            <Button
                mode={"contained"}
                onPress={() => {
                    props.formikProps.handleSubmit();
                    props.closeModal;
                }}
            >
                Save
            </Button>
        </View>
    );
};
