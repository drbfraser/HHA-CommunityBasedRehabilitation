import { StyleSheet } from "react-native";

const useStyles = () =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        userIdTextInput: {
            alignSelf: "stretch",
            marginHorizontal: 10,
        },
        row: {
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 15,
            marginTop: 5,
            marginRight: 15,
        },
        select: {
            flex: 1,
        },
        search: {
            flex: 2,
            marginLeft: 60,
        },
        item: {
            padding: 3,
            fontSize: 14,
            alignItems: "center",
            justifyContent: "center",
        },
        column_id: {
            flex: 0.4,
        },
        column_name: {
            flex: 1,
        },
        column_zone: {
            flex: 1,
        },
        column_role: {
            flex: 0.7,
        },
        column_status: {
            flex: 0.7,
        },
        wrappedView: {
            flexDirection: "row",
            flex: 1.5,
            alignItems: "center",
            padding: 5,
        },
    });

export default useStyles;
