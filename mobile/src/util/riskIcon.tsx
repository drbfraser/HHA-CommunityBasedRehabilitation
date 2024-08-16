import { RiskType } from "@cbr/common";
import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import i18n from "i18next";

const riskIcon = (name: string, color: string) => {
    return <Icon name={name} color={color} size={15} />;
};

export interface IRiskType {
    name: string;
    Icon: (color: string) => JSX.Element;
}

// On language change, recompute arrays of labels
export var riskTypes: { [key: string]: IRiskType } = {};
const refreshArrays = () => {
    riskTypes = {
        [RiskType.HEALTH]: {
            name: i18n.t("risks.health"),
            Icon: (color: string) => riskIcon("hospital-box", color),
        },
        [RiskType.EDUCATION]: {
            name: i18n.t("risks.education"),
            Icon: (color: string) => riskIcon("school", color),
        },
        [RiskType.SOCIAL]: {
            name: i18n.t("risks.social"),
            Icon: (color: string) => riskIcon("account-voice", color),
        },
        [RiskType.NUTRITION]: {
            name: i18n.t("risks.nutrition"),
            Icon: (color: string) => riskIcon("silverware-fork-knife", color),
        },
        [RiskType.MENTAL]: {
            name: i18n.t("risks.mental"),
            Icon: (color: string) => riskIcon("heart", color),
        },
        CIRCLE: {
            name: "Circle",
            Icon: (color: string) => riskIcon("circle", color),
        },
    };
};
refreshArrays();
i18n.on("languageChanged", () => {
    refreshArrays();
});