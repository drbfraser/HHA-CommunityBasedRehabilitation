import * as React from "react";
import { useState } from "react";
import { View } from "react-native";
import { IRisk, riskLevels, RiskType } from "@cbr/common";
import { Button, Card, Divider, Text } from "react-native-paper";
import clientStyle, { riskStyles } from "./ClientRisk.styles";

interface riskProps {
    clientRisks: IRisk[];
}

const getLatestRisk = (riskType: RiskType, clientRisk: IRisk[]) => {
    //Get the latest Risk for each type and pass the values on so they can be displayed initially
    const filteredRisks: IRisk[] = clientRisk.filter(
        (presentRisk) => presentRisk.risk_type === riskType
    );
    const latestRisk = filteredRisks.reduce(function (prev, current) {
        return prev.timestamp > current.timestamp ? prev : current;
    });
    return latestRisk;
};

export const ClientRisk = (props: riskProps) => {
    const styles = clientStyle();

    const [healthRisk, setHealthRisk] = useState<IRisk>(
        getLatestRisk(RiskType.HEALTH, props.clientRisks)
    );
    const [educationRisk, setEducationRisk] = useState<IRisk>(
        getLatestRisk(RiskType.EDUCATION, props.clientRisks)
    );
    const [socialRisk, setSocialRisk] = useState<IRisk>(
        getLatestRisk(RiskType.SOCIAL, props.clientRisks)
    );

    return (
        <View>
            <Text style={styles.cardSectionTitle}>Client Risks</Text>
            <Divider></Divider>
            <Card style={styles.riskCardStyle}>
                <View style={styles.riskCardContentStyle}>
                    <Text style={styles.riskTitleStyle}>Health</Text>
                    <Text
                        style={
                            riskStyles(riskLevels[healthRisk.risk_level].color).riskSubtitleStyle
                        }
                    >
                        {riskLevels[healthRisk.risk_level].name}
                    </Text>
                </View>
                <View>
                    <Text style={styles.riskHeaderStyle}>Requirements: </Text>
                    <Text style={styles.riskRequirementStyle}>{healthRisk.requirement}</Text>
                </View>
                <View>
                    <Text style={styles.riskHeaderStyle}>Goals: </Text>
                    <Text style={styles.riskRequirementStyle}>{healthRisk.goal}</Text>
                </View>
                <View style={styles.clientDetailsFinalView}>
                    <Button
                        mode="contained"
                        style={styles.clientDetailsFinalButtons}
                        disabled={false}
                    >
                        Update
                    </Button>
                </View>
            </Card>
            <Divider></Divider>
            <Card style={styles.riskCardStyle}>
                <View style={styles.riskCardContentStyle}>
                    <Text style={styles.riskTitleStyle}>Education</Text>
                    <Text
                        style={
                            riskStyles(riskLevels[educationRisk.risk_level].color).riskSubtitleStyle
                        }
                    >
                        {riskLevels[educationRisk.risk_level].name}
                    </Text>
                </View>
                <View>
                    <Text style={styles.riskHeaderStyle}>Requirements: </Text>
                    <Text style={styles.riskRequirementStyle}>{educationRisk.requirement}</Text>
                </View>
                <View>
                    <Text style={styles.riskHeaderStyle}>Goals: </Text>
                    <Text style={styles.riskRequirementStyle}>{educationRisk.goal}</Text>
                </View>
                <View style={styles.clientDetailsFinalView}>
                    <Button
                        mode="contained"
                        style={styles.clientDetailsFinalButtons}
                        disabled={false}
                    >
                        Update
                    </Button>
                </View>
            </Card>
            <Divider></Divider>
            <Card style={styles.riskCardStyle}>
                <View style={styles.riskCardContentStyle}>
                    <Text style={styles.riskTitleStyle}>Social</Text>
                    <Text
                        style={
                            riskStyles(riskLevels[socialRisk.risk_level].color).riskSubtitleStyle
                        }
                    >
                        {riskLevels[socialRisk.risk_level].name}
                    </Text>
                </View>
                <View>
                    <Text style={styles.riskHeaderStyle}>Requirements: </Text>
                    <Text style={styles.riskRequirementStyle}>{socialRisk.requirement}</Text>
                </View>
                <View>
                    <Text style={styles.riskHeaderStyle}>Goals: </Text>
                    <Text style={styles.riskRequirementStyle}>{socialRisk.goal}</Text>
                </View>
                <View style={styles.clientDetailsFinalView}>
                    <Button
                        mode="contained"
                        style={styles.clientDetailsFinalButtons}
                        disabled={false}
                    >
                        Update
                    </Button>
                </View>
            </Card>
        </View>
    );
};
