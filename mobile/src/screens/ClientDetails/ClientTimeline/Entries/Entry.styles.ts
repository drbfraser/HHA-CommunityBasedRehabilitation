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
            marginBottom: 15,
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
            flex: 1,
        },
        smallChip: { padding: 0, flex: 1 },
        closeBtn: {
            justifyContent: "flex-end",
            position: "absolute",
            right: 0,
            bottom: 0,
        },
    });

export default useStyles;
