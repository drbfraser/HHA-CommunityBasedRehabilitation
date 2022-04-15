import { StyleSheet } from "react-native";
import { themeColors } from "@cbr/common";

const useStyles = () =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        item: {
            padding: 3,
            fontSize: 12,
            alignItems: "center",
            justifyContent: "center",
        },
        select: {
            flex: 1,
        },
        search: {
            flex: 2,
        },
        row: {
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        textContainer: { flexDirection: "row", alignItems: "center" },
        text: { flexShrink: 1, fontSize: 12 },
        fontSize: {
            fontSize: 13,
        },
        title: {
            fontSize: 30,
        },
        column_client_name: {
            flex: 0.6,
            padding: 5,
        },
        column_client_zone: {
            flex: 0.6,
            padding: 5,
        },
        column_client_icon: {
            flex: 0.2,
            padding: 5,
        },
        column_client_Last_visit_date: {
            flex: 0.6,
            padding: 5,
        },

        column_referral_name: {
            flex: 1.5,
            padding: 5,
        },
        column_referral_type: {
            flex: 2,
            padding: 5,
        },
        column_referral_date: {
            flex: 1,
            padding: 5,
        },
    });

export default useStyles;
