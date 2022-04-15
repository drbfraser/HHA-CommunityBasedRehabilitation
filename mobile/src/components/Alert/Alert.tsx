import { MaterialIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { Text, TouchableRipple, useTheme } from "react-native-paper";
import React, { ComponentPropsWithRef } from "react";
import useStyles from "./Alert.styles";

export type AlertSeverity = "info" | "error";

export type AlertProps = ComponentPropsWithRef<typeof View> & {
    severity: AlertSeverity;
    /**
     * The text to display in the alert.
     */
    text: String;
    /**
     * Callback fired when the component requests to be closed. When provided, a close icon button
     * is displayed that triggers the callback when clicked. The parent is responsible for hiding
     * the alert.
     */
    onClose?: () => void;
};

/**
 * An alert displays a short, important message in a way that attracts the user's attention without
 * interrupting the user's task.
 *
 * This is a replacement for
 * {@link https://material-ui.com/components/alert/ material-ui's simple Alert}.
 */
const Alert = ({ severity, text, onClose, ...other }: AlertProps) => {
    const theme: ReactNativePaper.Theme = useTheme();
    const iconName = severity == "error" ? "error" : "info";
    const color = severity == "error" ? theme.colors.error : theme.colors.info;
    const styles = useStyles(color);
    return (
        <View {...other}>
            <View style={styles.alertContainer}>
                <View style={styles.iconAndTextContainer}>
                    <MaterialIcons name={iconName} style={styles.icon} size={30} color="white" />
                    <Text style={styles.text}>{text}</Text>
                </View>
                {onClose ? (
                    <TouchableRipple style={styles.actionIconButton} onPress={onClose}>
                        <MaterialIcons name="close" size={20} color={"black"} />
                    </TouchableRipple>
                ) : null}
            </View>
        </View>
    );
};

export default Alert;
