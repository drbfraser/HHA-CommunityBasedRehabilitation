import { themeColors } from "@cbr/common";
import { StyleSheet } from "react-native";

const useStyles = () =>
    StyleSheet.create({
        container: {
            margin: 3,
            justifyContent: "center",
        },
        item: {
            padding: 3,
            fontSize: 14,
            alignItems: "center",
            justifyContent: "center",
        },
        select: {
            flex: 0.75,
        },
        search: {
            flex: 1,
        },
        // columnBuilderButton: {
        //     flex: 0.2,
        // },
        colonBuilderChecklist: {
            marginHorizontal: 40,
            marginVertical: 70,
            // marginBottom: 70,
            display: "flex",
            backgroundColor: themeColors.white,
            borderRadius: 10,
            justifyContent: "center",
        },
        switch: {
            // flex: 0.2
        },
        // not used anywhere
        // switchButtonAndText: {
        //     flexDirection: "row",
        //     justifyContent: "flex-start",
        // },

        row: {
            //flexWrap: "wrap",
            margin: 3,
            padding: 4,
            // paddingVertical: 3,
            // paddingHorizontal: 5,
            // marginHorizontal: 5,
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "space-between",
        },

        rowItem: {
            flexDirection: "row",
            alignItems: "center",
        },
        checkbox: {
            // flexDirection: "row",
            // marginLeft: 10,
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
        // not used anywhere
        // viewWrapText: {
        //     flex: 1,
        //     alignItems: "center",
        //     justifyContent: "flex-start",
        //     padding: 5,
        // },
    });

export default useStyles;
