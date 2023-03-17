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
        alertMessageContainer: {
            borderWidth: 0.5,
            paddingLeft: 10,
            backgroundColor: "#EDEDED",
            borderColor: "#EDEDED",
        },
        deleteButton: {
            width: 100,
            margin: 10,
            alignSelf: "flex-end",
            backgroundColor: themeColors.white,
            borderColor: themeColors.riskRed,
            borderWidth: 1,
        },
        dropdownIcon: {
            fontWeight: "normal",
        },
    });

export default useStyles;
