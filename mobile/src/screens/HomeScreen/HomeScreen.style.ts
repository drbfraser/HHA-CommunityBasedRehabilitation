import { themeColors } from "@cbr/common";
import { StyleSheet } from "react-native";

const useStyles = () =>
    StyleSheet.create({
        headerStyle: {
            backgroundColor: themeColors.blueBgDark,
        },
        container: {
            flex: 1,
            padding: 24,
            justifyContent: "center",
            backgroundColor: "grey",
        },
        contentContainer: {
            flex: 1,
            alignItems: "center",
        },
        buttonContainer: {
            flex: 0.3,
            alignItems: "center",
        },
    });

export default useStyles;
