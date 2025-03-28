import { themeColors } from "@cbr/common";
import { StyleSheet } from "react-native";

const useStyles = () =>
    StyleSheet.create({
        container: {
            borderWidth: 1,
            borderColor: themeColors.lightGray,
            shadowColor: themeColors.riskBlack,
        },
        title: { fontWeight: "bold" },
    });

export default useStyles;
