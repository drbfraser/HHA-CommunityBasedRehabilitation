import { themeColors } from "@cbr/common";
import { StyleSheet } from "react-native";

const useStyles = () =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        groupContainer: {
            padding: 10,
            marginBottom: 10,
        },
        btnContainer: {
            justifyContent: "space-around",
            marginBottom: 10,
        },
        cardSectionTitle: {
            textAlign: "center",
            marginTop: 14,
            marginBottom: 14,
            fontSize: 28,
            color: themeColors.blueBgDark,
        },
        CardStyle: {
            display: "flex",
            padding: 20,
            borderRadius: 20,
            marginBottom: 10,
        },
    });

export default useStyles;
