import * as React from "react";
import { Component } from "react";
import { View } from "react-native";
import {
    Button,
    Card,
    TextInput,
    Checkbox,
    Menu,
    Divider,
    ActivityIndicator,
    Text,
} from "react-native-paper";
import clientStyle from "./Client.styles";

interface riskProps {
    editMode: boolean;
}

export const ClientRisk = (props: riskProps) => {
    const styles = clientStyle();
    return (
        <View>
            <Text style={styles.cardSectionTitle}>Client Risks</Text>
            <Divider></Divider>
            <Card style={styles.riskCardStyle}>
                <View style={styles.riskCardContentStyle}>
                    <Text style={styles.riskTitleStyle}>Health</Text>
                    <Text style={styles.riskSubtitleStyle}>CRITICAL</Text>
                </View>
                <View>
                    <Text style={styles.riskHeaderStyle}>Requirements: </Text>
                    <Text style={styles.riskRequirementStyle}>Requrements go here</Text>
                </View>
                <View>
                    <Text style={styles.riskHeaderStyle}>Goals: </Text>
                    <Text style={styles.riskRequirementStyle}>Goals go here</Text>
                </View>
                <View style={styles.clientDetailsFinalView}>
                    <Button
                        mode="contained"
                        style={styles.clientDetailsFinalButtons}
                        disabled={false}
                    >
                        {props.editMode ? "Edit" : "Save"}
                    </Button>
                </View>
            </Card>
            <Divider></Divider>
            <Card style={styles.riskCardStyle}>
                <View style={styles.riskCardContentStyle}>
                    <Text style={styles.riskTitleStyle}>Education</Text>
                    <Text style={styles.riskSubtitleStyle}>CRITICAL</Text>
                </View>
                <View>
                    <Text style={styles.riskHeaderStyle}>Requirements: </Text>
                    <Text style={styles.riskRequirementStyle}>Requrements go here</Text>
                </View>
                <View>
                    <Text style={styles.riskHeaderStyle}>Goals: </Text>
                    <Text style={styles.riskRequirementStyle}>Goals go here</Text>
                </View>
                <View style={styles.clientDetailsFinalView}>
                    <Button
                        mode="contained"
                        style={styles.clientDetailsFinalButtons}
                        disabled={false}
                    >
                        {props.editMode ? "Edit" : "Save"}
                    </Button>
                </View>
            </Card>
            <Divider></Divider>
            <Card style={styles.riskCardStyle}>
                <View style={styles.riskCardContentStyle}>
                    <Text style={styles.riskTitleStyle}>Social</Text>
                    <Text style={styles.riskSubtitleStyle}>CRITICAL</Text>
                </View>
                <View>
                    <Text style={styles.riskHeaderStyle}>Requirements: </Text>
                    <Text style={styles.riskRequirementStyle}>Requrements go here</Text>
                </View>
                <View>
                    <Text style={styles.riskHeaderStyle}>Goals: </Text>
                    <Text style={styles.riskRequirementStyle}>Goals go here</Text>
                </View>
                <View style={styles.clientDetailsFinalView}>
                    <Button
                        mode="contained"
                        style={styles.clientDetailsFinalButtons}
                        disabled={false}
                    >
                        {props.editMode ? "Edit" : "Save"}
                    </Button>
                </View>
            </Card>
        </View>
    );
};
