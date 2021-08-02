import * as React from "react";
import { Component } from "react";
import { View } from "react-native";
import { Button, Modal, Portal, TextInput, Text } from "react-native-paper";
import { useState } from "react";
import useStyles from "../ClientDetails.styles";
import { IRisk } from "@cbr/common";

export interface ClientRiskFormProps {
    risk: IRisk;
}

export const ClientRiskForm = (props: ClientRiskFormProps) => {
    const styles = useStyles();
    return (
        <View>
            <Text>Update Health Risk</Text>
            <TextInput
                style={styles.clientTextStyle}
                label={"Requirements"}
                value={props.risk.requirement}
            />
            <TextInput style={styles.clientTextStyle} label={"Goals"} value={props.risk.goal} />
        </View>
    );
};
