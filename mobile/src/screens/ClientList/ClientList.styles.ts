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
        switch: { flex: 0.2 },
        modal: {
            margin: 35,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: themeColors.white,
        },
        row: {
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
        column_icons: {
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
    });

export default useStyles;
