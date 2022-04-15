import { themeColors } from "@cbr/common";
import { Dimensions, StyleSheet } from "react-native";

const useStyles = () =>
    StyleSheet.create({
        modalView: {
            margin: 0,
            justifyContent: "flex-end",
        },
        container: {
            flexDirection: "row",
        },
        content: {
            flex: 1,
            alignItems: "center",
            backgroundColor: themeColors.white,
            paddingVertical: 15,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
        },
        buttonView: {
            flexDirection: "row",
            alignContent: "space-around",
        },

        button: {
            fontSize: 18,
            color: themeColors.blueBgDark,
        },
    });

export default useStyles;
