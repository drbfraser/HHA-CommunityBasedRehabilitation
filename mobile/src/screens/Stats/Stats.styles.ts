import { themeColors } from "@cbr/common/src/util/colors";
import { StyleSheet } from "react-native";

const useStyles = () =>
    StyleSheet.create({
        title: {
            fontSize: 30,
            color: themeColors.borderGray,
        },
        link: {
            textAlign: "center",
            color: themeColors.blueAccent,
        },
        chartTitle: {
            margin: 5,
            fontWeight: "bold",
            textAlign: "center",
            fontSize: 15,
        },
        graphStat: {
            margin: 5,
            textAlign: "center",
            fontSize: 15,
        },
        filterBtn: {
            marginTop: 15,
            alignSelf: "center",
            backgroundColor: themeColors.blueAccent,
        },
        row: {
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
        },
        btnRow: {
            flexDirection: "row",
            margin: 10,
            flexWrap: "wrap",
            justifyContent: "space-evenly",
        },
        btnWrapper: {
            marginBottom: 10,
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
