import { riskLevels, RiskType } from "./risks";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
export function healthIcon(props: string) {
    return (
        <MaterialIcons
            name={"local-hospital"}
            size={32}
            color={props}
        />
    );
}
export function educationIcon(props: string) {
    return (
        <MaterialIcons
            name={"school"}
            size={32}
            color={props}
        />
    );
}
export function socialIcon(props: string) {
    return (
        <MaterialIcons
            name={"record-voice-over"}
            size={32}
            color={props}
        />
    );
}

export interface IRiskType {
    name: string;
    Icon: typeof healthIcon|typeof educationIcon|typeof socialIcon;
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