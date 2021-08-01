import { StyleSheet } from "react-native";

const useStyles = () =>
    StyleSheet.create({
        container: {
            flex: 1,
            zIndex: 0,
        },
        item: {
            padding: 3,
            fontSize: 14,
            alignItems: "center",
            justifyContent: "center",
            zIndex: 0,
        },
        select: {
            flex: 1,
            zIndex: 0,
        },
        search: {
            flex: 2,
            zIndex: 0,
        },
        row: {
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        column_id: {
            flex: 0.7,
            zIndex: 0,
        },
        column_name: {
            flex: 1.5,
            zIndex: 0,
        },
        column_zone: {
            flex: 1.5,
            zIndex: 0,
        },
        column_icons: {
            flex: 0.8,
            zIndex: 0,
        },
        wrappedView: {
            flexDirection: "row",
            flex: 1.5,
            alignItems: "center",
            padding: 5,
            zIndex: 0,
        },
        text: {
            flexShrink: 1,
        },
    });

export default useStyles;
