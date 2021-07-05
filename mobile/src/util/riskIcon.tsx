import { riskLevels, RiskType } from "./risks";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";

const healthIcon = (props: string) => {
    return <MaterialIcons name={"local-hospital"} size={32} color={props} />;
};

const educationIcon = (props: string) => {
    return <MaterialIcons name={"school"} size={32} color={props} />;
};

const socialIcon = (props: string) => {
    return <MaterialIcons name={"record-voice-over"} size={32} color={props} />;
};

export interface IRiskType {
    name: string;
    Icon: typeof healthIcon | typeof educationIcon | typeof socialIcon;
}

export const riskTypes: { [key: string]: IRiskType } = {
    [RiskType.HEALTH]: {
        name: "Health",
        Icon: healthIcon,
    },
    [RiskType.EDUCATION]: {
        name: "Education",
        Icon: educationIcon,
    },
    [RiskType.SOCIAL]: {
        name: "Social",
        Icon: socialIcon,
    },
};
