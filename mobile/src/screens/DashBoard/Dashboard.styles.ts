import { StyleSheet } from "react-native";

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
        fontSize: {
            fontSize: 13,
        },
        title: {
            fontSize: 30,
        },
        card: {
            paddingBottom: 50,
            padding: 10,
            height: 500,
        },

        column_client_name: {
            flex: 0.8,
            padding: 5,
            justifyContent: "center",
        },
        column_client_zone: {
            flex: 1,
            padding: 5,
            justifyContent: "center",
        },
        column_client_icon: {
            flex: 0.2,
            padding: 5,
            justifyContent: "center",
        },
        column_client_Last_visit_date: {
            flex: 0.8,
            padding: 5,
            justifyContent: "center",
        },

        column_referral_name: {
            flex: 2,
            padding: 5,
            justifyContent: "center",
        },
        column_referral_type: {
            flex: 2,
            padding: 5,
            justifyContent: "center",
        },
        column_referral_date: {
            flex: 1,
            padding: 5,
            justifyContent: "center",
        },
    });

export default useStyles;
