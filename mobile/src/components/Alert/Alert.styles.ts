import { StyleSheet } from "react-native";

const useStyles = (color: string) =>
    StyleSheet.create({
        alertContainer: {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingHorizontal: 10,
            height: 60,
            borderRadius: 10,
            backgroundColor: color,
        },
        text: {
            color: "white",
            fontSize: 16,
            fontWeight: "bold",
        },
    });

export default useStyles;
