import { themeColors } from "@cbr/common";
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
        select: {
            flex: 1,
        },
        title: {
            textAlign: "center",
            fontSize: 14,
        },
        text: {
            flexShrink: 1,
        },
        search: {
            flex: 2,
            marginLeft: 60,
        },
        item: {
            padding: 3,
            fontSize: 50,
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
