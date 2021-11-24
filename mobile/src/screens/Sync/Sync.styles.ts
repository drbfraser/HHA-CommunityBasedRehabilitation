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
            flex: 1,
            padding: 10,
        },
        btnContainer: {
            flex: 1,
            justifyContent: "space-around",
        },
        resetBtbContainer: {
            backgroundColor: "white",
        },
        resetBtnLabel: {
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
