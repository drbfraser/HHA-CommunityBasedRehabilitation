import { StyleSheet } from "react-native";
import { themeColors } from "@cbr/common";
import theme from "../../util/theme.styles";

const useStyles = () => {

    return StyleSheet.create({
        container: {
            flex: 1, 
        }, 
        groupContainer: {
            padding: 10
        }, 
        cardSectionTitle: {
            textAlign: "center",
            marginTop: 14,
            marginBottom: 14,
            fontSize: 28,
            color: themeColors.blueBgDark,
        }, 
        CardStyle: {
            display: "flex",
            padding: 20,
            borderRadius: 20,
            marginBottom: 10,
        }, 
        row: {
            flexDirection: "row",
            paddingTop: 5,
            paddingBottom: 5,
            justifyContent: "space-between",
        }, 
        chipText: {
            color: themeColors.white
        },
        chipLive: {
            backgroundColor: themeColors.hhaGreen, 
            height: 35
        }, 
        chipTest: {
            backgroundColor: themeColors.riskYellow, 
            height: 35
        }, 
        radioButtonPassive: {
            marginBottom: 10, 
            height: 60, 
            justifyContent: "center", 
            borderRadius: 10,
            borderWidth: 2, 
            backgroundColor: themeColors.white,
            borderColor: theme.colors.backdrop
        }, 
        radioButtonSelected: {
            marginBottom: 10, 
            height: 60, 
            justifyContent: "center", 
            borderRadius: 10, 
            borderWidth: 2, 
            backgroundColor: themeColors.white, 
            borderColor: themeColors.hhaGreen
        }, 
        switchServerButton: {
            marginTop: 50
        }
    });
}

export default useStyles;
