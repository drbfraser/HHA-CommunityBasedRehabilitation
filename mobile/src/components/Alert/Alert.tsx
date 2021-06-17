import { MaterialIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import React from "react";
import useStyles from "./Alert.styles";

export enum AlertType {
    INFO,
    ERROR,
}

export interface AlertProps {
    alertType: AlertType;
    text: String;
}

const Alert = (alertProps: AlertProps) => {
    const theme: ReactNativePaper.Theme = useTheme();
    const iconName = alertProps.alertType == AlertType.ERROR ? "error" : "info";
    const color = alertProps.alertType == AlertType.ERROR ? theme.colors.error : theme.colors.info;
    const styles = useStyles(color);
    return (
        <View style={styles.alertContainer} {...alertProps}>
            <MaterialIcons
                name={iconName}
                style={{ alignSelf: "flex-start" }}
                size={30}
                color="white"
            />
            <View style={{ margin: 10 }} />
            <Text style={styles.text}>{alertProps.text}</Text>
        </View>
    );
};

export default Alert;
