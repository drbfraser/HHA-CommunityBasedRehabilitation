import React, { useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { Card, Divider, Text } from "react-native-paper";

import { IRisk, riskLevels, RiskType } from "@cbr/common";
import clientStyle, { riskStyles } from "./ClientRisk.styles";
import { ClientRiskForm } from "./ClientRiskForm";

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
    const [risk, setRisk] = useState<IRisk>(
        getLatestRisks(props.clientRisks, props.presentRiskType)
    );
    const { t } = useTranslation();

    const getRiskTitle = (): string => {
        switch (risk.risk_type) {
            case RiskType.HEALTH:
                return t("general.health");
            case RiskType.EDUCATION:
                return t("general.education");
            case RiskType.SOCIAL:
                return t("general.social");
            case RiskType.NUTRITION:
                return t("general.nutrition");
            case RiskType.MENTAL:
                return t("general.mental");
            default:
                console.error("Unknown Risk Type:", risk.risk_type);
                return "";
        }
    };

    return (
        <View>
            <View key={risk.risk_type}>
                <Divider />
                <Card style={styles.riskCardStyle}>
                    <View style={styles.riskCardContentStyle}>
                        <Text style={styles.riskTitleStyle}>{getRiskTitle()}</Text>
                        <Text
                            style={riskStyles(riskLevels[risk.risk_level].color).riskSubtitleStyle}
                        >
                            {riskLevels[risk.risk_level].name}
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

                    <View style={styles.clientDetailsFinalView} />

                    <View>
                        <ClientRiskForm
                            riskData={risk}
                            setRisk={setRisk}
                            clientArchived={props.clientArchived}
                        />
                    </View>
                </Card>
                <Divider />
            </View>
        </View>
    );
};
