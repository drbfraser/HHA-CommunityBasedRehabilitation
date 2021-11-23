import { themeColors } from "@cbr/common/src/util/colors";
import { StyleSheet } from "react-native";

const useStyles = () =>
    StyleSheet.create({
        title: {
            fontSize: 30,
            color: themeColors.borderGray,
        },
        graphStat: {
            textAlign: "center",
        },
        row: {
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        btnRow: {
            padding: 10,
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
        },
        scrollViewStyles: {
            marginHorizontal: 5,
        },
        container: {
            flex: 1,
        },
        graphContainer: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
        },
        cardSectionTitle: {
            textAlign: "center",
            marginTop: 14,
            marginBottom: 14,
            fontSize: 32,
        },
    });

export default useStyles;
