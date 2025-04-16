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

        column_referral_status: {
            flex: 0.5,
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

        filterContainer: {
            flexDirection: "row",
            flexWrap: "wrap",
            marginBottom: 10,
        },

        chip: {
            marginRight: 5,
            marginBottom: 5,
        },

        filterView: {
            padding: 10,
        },

        filterLabel: {
            fontSize: 14,
            fontWeight: "600",
            marginBottom: 4,
            color: "#666",
        },
    });

export default useStyles;
