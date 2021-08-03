import * as React from "react";
import { useState } from "react";
import { View } from "react-native";
import { IRisk, riskLevels, RiskType } from "@cbr/common";
import { Button, Card, Divider, Modal, Portal, Text } from "react-native-paper";
import clientStyle, { riskStyles } from "./ClientRisk.styles";
import { ClientRiskForm } from "./ClientRiskForm";
import { Formik } from "formik";

interface riskProps {
    clientRisks: IRisk[];
}

const getLatestRisks = (clientRisk: IRisk[]) => {
    //Get the latest Risk for each type and pass the values on so they can be displayed initially
    let latestRisks: IRisk[] = [];
    const filteredHealthRisks: IRisk[] = clientRisk.filter(
        (presentRisk) => presentRisk.risk_type === RiskType.HEALTH
    );
    const filteredEducationRisks: IRisk[] = clientRisk.filter(
        (presentRisk) => presentRisk.risk_type === RiskType.EDUCATION
    );
    const filteredSocialRisks: IRisk[] = clientRisk.filter(
        (presentRisk) => presentRisk.risk_type === RiskType.SOCIAL
    );
    let latestHealthRisk = filteredHealthRisks.reduce(function (prev, current) {
        return prev.timestamp > current.timestamp ? prev : current;
    });
    let latestEducationRisk = filteredEducationRisks.reduce(function (prev, current) {
        return prev.timestamp > current.timestamp ? prev : current;
    });
    let latestSocialtRisk = filteredSocialRisks.reduce(function (prev, current) {
        return prev.timestamp > current.timestamp ? prev : current;
    });
    latestRisks.push(latestHealthRisk);
    latestRisks.push(latestEducationRisk);
    latestRisks.push(latestSocialtRisk);
    return latestRisks;
};

export const ClientRisk = (props: riskProps) => {
    const styles = clientStyle();

    const [latestRisks, setLatestRisks] = useState<IRisk[]>(getLatestRisks(props.clientRisks));

    return (
        <View>
            <Text style={styles.cardSectionTitle}>Client Risks</Text>
            {latestRisks.map((presentRisk) => {
                return (
                    //Reason key is type is because we want only one of each type
                    <View key={presentRisk.risk_type}>
                        <Divider></Divider>
                        <Card style={styles.riskCardStyle}>
                            <View style={styles.riskCardContentStyle}>
                                {presentRisk.risk_type === RiskType.HEALTH ? (
                                    <Text style={styles.riskTitleStyle}>Health</Text>
                                ) : (
                                    <></>
                                )}
                                {presentRisk.risk_type === RiskType.EDUCATION ? (
                                    <Text style={styles.riskTitleStyle}>Education</Text>
                                ) : (
                                    <></>
                                )}
                                {presentRisk.risk_type === RiskType.SOCIAL ? (
                                    <Text style={styles.riskTitleStyle}>Social</Text>
                                ) : (
                                    <></>
                                )}

                                <Text
                                    style={
                                        riskStyles(riskLevels[presentRisk.risk_level].color)
                                            .riskSubtitleStyle
                                    }
                                >
                                    {riskLevels[presentRisk.risk_level].name}
                                </Text>
                            </View>
                            <View>
                                <Text style={styles.riskHeaderStyle}>Requirements: </Text>
                                <Text style={styles.riskRequirementStyle}>
                                    {presentRisk.requirement}
                                </Text>
                            </View>
                            <View>
                                <Text style={styles.riskHeaderStyle}>Goals: </Text>
                                <Text style={styles.riskRequirementStyle}>{presentRisk.goal}</Text>
                            </View>
                            <View style={styles.clientDetailsFinalView}></View>

                            <View>
                                <ClientRiskForm riskData={presentRisk} />
                            </View>
                        </Card>

                        <Divider></Divider>
                    </View>
                );
            })}
        </View>
    );
};
