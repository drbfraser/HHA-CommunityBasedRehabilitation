import { StyleSheet } from "react-native";

export const useStyles = () =>
    StyleSheet.create({
        alert: {
            marginVertical: 0,
        },
        buttonContainer: {
            marginVertical: 10,
            flexDirection: "row",
            justifyContent: "flex-end",
        },
    });
