import { themeColors } from "@cbr/common";
import { StyleSheet } from "react-native";

const useStyles = () =>
    StyleSheet.create({
        modal: {
            margin: 20,
            padding: 20,
            backgroundColor: themeColors.white,
        },
        button: {
            flex: 1,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 10,
        },
        buttonText: {
            fontSize: 16,
        },
        editIcon: {
            alignSelf: "center",
        },
    });

export default useStyles;
