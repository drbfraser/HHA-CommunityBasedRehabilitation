import { themeColors } from "@cbr/common";
import { StyleSheet } from "react-native";

const useStyles = () =>
    StyleSheet.create({
        headerStyle: {
            backgroundColor: themeColors.blueBgDark,
        },
    });

export default useStyles;
