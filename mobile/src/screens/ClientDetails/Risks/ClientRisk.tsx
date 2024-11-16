import React, { useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { Card, Divider, Text } from "react-native-paper";

import { IRisk, riskLevels, RiskType } from "@cbr/common";
import clientStyle, { riskStyles } from "./ClientRisk.styles";
import { ClientRiskForm } from "./ClientRiskForm";
import {
    generateFormValue,
    initializeCheckedItems,
    initializeFreeformText,
} from "../../../components/ModalForm/utils";

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

interface riskProps {
    clientRisks: IRisk[];
    presentRiskType: RiskType;
    clientArchived: boolean;
}

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

    const getDisplayedRequirements = () => {
        // can probably extract this mapping of translated arrays outside of this module
        // so that other code that use the modal form component can use this
        let translationKey;
        switch (risk.risk_type) {
            case RiskType.SOCIAL:
                translationKey = "newVisit.socialRequirements";
                break;
            case RiskType.HEALTH:
                translationKey = "newVisit.healthRequirements";
                break;
            case RiskType.MENTAL:
                translationKey = "newVisit.healthRequirements";
                break;
            case RiskType.NUTRITION:
                translationKey = "newVisit.healthRequirements";
                break;
            case RiskType.EDUCATION:
                translationKey = "newVisit.healthRequirements";
                break;
        }

        const translatedItems = Object.entries(
            initializeCheckedItems(
                risk.requirement,
                t(translationKey, { returnObjects: true, lng: "en" }),
                t(translationKey, { returnObjects: true })
            )
        );
        const otherText = initializeFreeformText(
            risk.requirement,
            t(translationKey, { returnObjects: true, lng: "en" })
        );

        return generateFormValue(translatedItems, otherText);
    };

    return (
        <View key={risk.risk_type}>
            <Divider />

            <Card style={styles.riskCardStyle}>
                <View style={styles.riskCardContentStyle}>
                    <Text style={styles.riskTitleStyle}>{getRiskTitle()}</Text>
                    <Text style={riskStyles(riskLevels[risk.risk_level].color).riskSubtitleStyle}>
                        {riskLevels[risk.risk_level].name}
                    </Text>
                </View>

                <View>
                    <Text style={styles.riskHeaderStyle}>{t("general.requirements")}: </Text>
                    <Text style={styles.riskRequirementStyle}>{getDisplayedRequirements()}</Text>
                </View>
                <View>
                    <Text style={styles.riskHeaderStyle}>{t("general.goals")}: </Text>
                    <Text style={styles.riskRequirementStyle}>{risk.goal}</Text>
                </View>

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
    );
};
