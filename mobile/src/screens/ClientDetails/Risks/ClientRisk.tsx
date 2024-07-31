import * as React from "react";
import { useState } from "react";
import { View } from "react-native";
import { IRisk, riskLevels, RiskType } from "@cbr/common";
import { Button, Card, Divider, Modal, Portal, Text } from "react-native-paper";
import clientStyle, { riskStyles } from "./ClientRisk.styles";
import { ClientRiskForm } from "./ClientRiskForm";
import { Formik } from "formik";
import { useTranslation } from "react-i18next";

interface riskProps {
    clientRisks: IRisk[];
    presentRiskType: RiskType;
    clientArchived: boolean;
}

const getLatestRisks = (clientRisk: IRisk[], riskType: RiskType) => {
    // Get the latest Risk for each type and pass the values on so they can be displayed initially
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
    const [risk, setRisk] = useState<any>(getLatestRisks(props.clientRisks, props.presentRiskType));
    const { t } = useTranslation();

    return (
        <View>
            <View key={risk.risk_type}>
                <Divider></Divider>
                <Card style={styles.riskCardStyle}>
                    <View style={styles.riskCardContentStyle}>
                        {risk.risk_type === RiskType.HEALTH ? (
                            <Text style={styles.riskTitleStyle}>{t("general.health")}</Text>
                        ) : risk.risk_type === RiskType.EDUCATION ? (
                            <Text style={styles.riskTitleStyle}>{t("general.education")}</Text>
                        ) : risk.risk_type === RiskType.SOCIAL ? (
                            <Text style={styles.riskTitleStyle}>{t("general.social")}</Text>
                        ) : risk.risk_type === RiskType.NUTRITION ? (
                            <Text style={styles.riskTitleStyle}>{t("general.nutrition")}</Text>
                        ) : (
                            <Text style={styles.riskTitleStyle}>{t("general.mental")}</Text>
                        )}
                        <Text
                            style={riskStyles(riskLevels[risk.risk_level].color).riskSubtitleStyle}
                        >
                            {t([`riskLevels.${riskLevels[risk.risk_level].name}`])}
                        </Text>
                    </View>
                    <View>
                        <Text style={styles.riskHeaderStyle}>{t("general.requirements")}: </Text>
                        <Text style={styles.riskRequirementStyle}>{risk.requirement}</Text>
                    </View>
                    <View>
                        <Text style={styles.riskHeaderStyle}>{t("general.goals")}: </Text>
                        <Text style={styles.riskRequirementStyle}>{risk.goal}</Text>
                    </View>
                    <View style={styles.clientDetailsFinalView}></View>

                    <View>
                        <ClientRiskForm
                            riskData={risk}
                            setRisk={setRisk}
                            clientArchived={props.clientArchived}
                        />
                    </View>
                </Card>
                <Divider></Divider>
            </View>
        </View>
    );
};
