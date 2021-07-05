import { StyleSheet } from "react-native";

const useStyles = (color: string) =>
    StyleSheet.create({
        alertContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 10,
            borderRadius: 7,
            backgroundColor: color,
            flex: 1,
        },
        iconAndTextContainer: {
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
        },
        icon: { alignSelf: "flex-start" },
        text: {
            color: "white",
            marginLeft: 10,
            fontSize: 16,
            fontWeight: "bold",
            flexShrink: 1,
        },
        actionIconButton: {
            padding: 5,
            alignSelf: "center",
            justifyContent: "flex-end",
        },
    });

export default useStyles;
