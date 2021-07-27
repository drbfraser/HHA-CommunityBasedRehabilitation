import { themeColors } from "@cbr/common";
import { StyleSheet } from "react-native";

const useStyles = () =>
    StyleSheet.create({
        createdCard: {
            borderWidth: 1,
            shadowColor: themeColors.riskBlack,
            marginRight: 17,
            marginLeft: 1,
            padding: 1,
        },
    });

export default useStyles;
