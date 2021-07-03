import { StyleSheet } from "react-native";

export const useStyles = () =>
    StyleSheet.create({
        alert: {
            marginVertical: 10,
        },
        buttonContainer: {
            marginVertical: 10,
            flexDirection: "row",
            justifyContent: "flex-end",
        },
        passwordTextInput: {
            marginVertical: 5,
        },
    });
