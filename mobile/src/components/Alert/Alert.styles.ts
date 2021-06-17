import { StyleSheet } from "react-native";

const useStyles = (color: string) =>
    StyleSheet.create({
        alertContainer: {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            padding: 10,
            borderRadius: 10,
            backgroundColor: color,
        },
        text: {
            color: "white",
            fontSize: 16,
            fontWeight: "bold",
            flexShrink: 1,
        },
    });

export default useStyles;
