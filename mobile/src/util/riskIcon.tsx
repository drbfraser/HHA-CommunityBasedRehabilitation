import { riskLevels } from "./risks";
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

