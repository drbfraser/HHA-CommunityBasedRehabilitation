import { themeColors } from "@cbr/common";
import { StyleSheet } from "react-native";

const useStyles = () =>
    StyleSheet.create({
        container: {
            flex: 1,
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
        },
        columnBuilderButton: {
            flex: 0.2,
        },
        colonBuilderChecklist: {
            marginHorizontal: 40,
            marginTop: 70,
            marginBottom: 70,
            display: "flex",
            backgroundColor: themeColors.white,
            borderRadius: 10,
            justifyContent: "center",
        },
        switch: { flex: 0.2 },
        switchButtonAndText: {
            flexDirection: "row",
            justifyContent: "flex-start",
        },

        row: {
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        checkbox: {
            flexDirection: "row",
            marginLeft: 10,
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
        viewWrapText: {
            flex: 1,
            alignItems: "center",
            justifyContent: "flex-start",
            padding: 5,
        },
    });

export default useStyles;
