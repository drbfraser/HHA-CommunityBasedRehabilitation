import { themeColors } from "@cbr/common";
import { StyleSheet } from "react-native";
import theme from "../../util/theme.styles";

const useStyles = () =>
    StyleSheet.create({
        scrollViewStyles: {
            marginHorizontal: 5,
        },
        container: {
            flex: 1,
        },
        groupContainer: {
            padding: 10,
            marginBottom: 10
        },
        btnContainer: {
            justifyContent: "space-around",
            marginBottom: 10
        },
        syncBtbContainer: {
            height: 60,
            justifyContent: "center",
            marginBottom: 10
        },
        resetBtbContainer: {
            backgroundColor: "white",
            height: 60,
            justifyContent: "center",
        },
        syncBtnLabel: {
            fontSize: 18,
        },
        resetBtnLabel: {
            fontSize: 18,
            color: themeColors.errorRed,
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
            marginBottom: 10
        },
        row: {
            flexDirection: "row",
            height: 40,
            justifyContent: "space-between",
        },
        stats: {
            color: themeColors.borderGray,
        },
        switch: { flex: 0.2 },
    });

export default useStyles;
