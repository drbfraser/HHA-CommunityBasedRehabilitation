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
            justifyContent: "center",
            padding: 10,
        },
    });

export default useStyles;
