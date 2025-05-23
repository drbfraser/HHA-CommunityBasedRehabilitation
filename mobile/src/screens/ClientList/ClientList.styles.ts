import { StyleSheet } from "react-native";
import { themeColors } from "@cbr/common";

const useStyles = () =>
    StyleSheet.create({
        container: {
            margin: 5,
            justifyContent: "center",
        },
        item: {
            padding: 3,
            fontSize: 14,
            alignItems: "center",
            justifyContent: "center",
        },
        select: {
            flex: 1,
        },
        search: {
            flex: 1,
            marginBottom: 5,
        },
        colonBuilderChecklist: {
            marginHorizontal: 40,
            marginVertical: 70,
            display: "flex",
            backgroundColor: themeColors.white,
            borderRadius: 10,
            justifyContent: "center",
        },
        row: {
            margin: 3,
            padding: 4,
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "space-between",
        },
        rowItem: {
            paddingTop: 5,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },
        column_id: {
            flex: 0.7,
        },
        column_name: {
            flex: 1.5,
        },
        column_zone: {
            flex: 1.5,
        },
        columnIcons: {
            flex: 0.8,
        },
        wrappedView: {
            flexDirection: "row",
            flex: 1.5,
            alignItems: "center",
            padding: 5,
        },
        text: {
            flexShrink: 1,
        },
        textGray: {
            color: themeColors.textGray,
        },
    });

export default useStyles;
