import { themeColors } from "@cbr/common";
import { StyleSheet } from "react-native";

const useStyles = () =>
    StyleSheet.create({
        createdCard: {
            borderWidth: 1,
            shadowColor: themeColors.riskBlack,
            marginRight: 30,
            marginLeft: 10,
            padding: 1,
        },
    });

export default useStyles;
