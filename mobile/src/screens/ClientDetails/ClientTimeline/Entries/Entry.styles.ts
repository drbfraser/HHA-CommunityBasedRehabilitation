import { themeColors } from "@cbr/common";
import { StyleSheet } from "react-native";

const useStyles = () =>
    StyleSheet.create({
        createdCard: {
            borderWidth: 1,
            shadowColor: themeColors.riskBlack,
            marginRight: 30,
            marginLeft: 10,
            padding: 1,
        },
        labelBold: { fontWeight: "bold" },
        referralBoard: {
            marginRight: 3,
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 10,
            paddingBottom: 10,
            marginBottom: 15,
        },
        errorText: { color: themeColors.errorRed, paddingLeft: 15 },
        referralChip: {
            padding: 5,
            margin: 3,
            flexDirection: "row",
            flexWrap: "wrap",
        },
        smallChip: { padding: 0 },
    });

export default useStyles;
