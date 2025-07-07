import React from "react";
import { Trans } from "react-i18next";
import { RiskType } from "@cbr/common/util/risks";

export const translateRiskEntrySummary = (riskType: RiskType, isInitial: boolean) => {
    const setOrChanged = isInitial ? "Set" : "Changed";

    switch (riskType) {
        case RiskType.HEALTH:
            return (
                <Trans i18nKey={isInitial ? "risks.healthSet" : "risks.healthChanged"}>
                    -<b>Health</b> risk {setOrChanged} to
                </Trans>
            );
        case RiskType.EDUCATION:
            return (
                <Trans i18nKey={isInitial ? "risks.educationSet" : "risks.educationChanged"}>
                    -<b>Education</b> risk {setOrChanged} to
                </Trans>
            );
        case RiskType.MENTAL:
            return (
                <Trans i18nKey={isInitial ? "risks.mentalSet" : "risks.mentalChanged"}>
                    -<b>Mental health</b> risk {setOrChanged} to
                </Trans>
            );
        case RiskType.NUTRITION:
            return (
                <Trans i18nKey={isInitial ? "risks.nutritionSet" : "risks.nutritionChanged"}>
                    -<b>Nutrition</b> risk {setOrChanged} to
                </Trans>
            );
        case RiskType.SOCIAL:
            return (
                <Trans i18nKey={isInitial ? "risks.socialSet" : "risks.socialChanged"}>
                    -<b>Social</b> risk {setOrChanged} to
                </Trans>
            );
        default:
            console.error(`unknown risktype: ${riskType}`);
            return <></>;
    }
};

export const translateGoalEntrySummary = (riskType: RiskType) => {

    switch (riskType) {
        case RiskType.HEALTH:
            return (
                <Trans>
                    <b>Health</b> goal status set to
                </Trans>
            );
        case RiskType.EDUCATION:
            return (
                <Trans>
                    <b>Education</b> goal status set to
                </Trans>
            );
        case RiskType.MENTAL:
            return (
                <Trans>
                    <b>Mental health</b> goal status set to
                </Trans>
            );
        case RiskType.NUTRITION:
            return (
                <Trans>
                    <b>Nutrition</b> goal status set to
                </Trans>
            );
        case RiskType.SOCIAL:
            return (
                <Trans>
                    <b>Social</b> goal status set to
                </Trans>
            );
        default:
            console.error(`unknown risktype: ${riskType}`);
            return <></>;
    }
};