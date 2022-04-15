import { themeColors } from "@cbr/common";
import { StyleSheet } from "react-native";

const useStyles = () =>
    StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            marginLeft: 30,
            marginRight: 30,
        },
        nextButton: {
            position: "absolute",
            right: -50,
            bottom: -10,
            padding: -1,
        },
        errorAlert: {
            marginVertical: 10,
        },
        prevButton: {
            position: "absolute",
            left: -50,
            bottom: -10,
            padding: -1,
        },
        buttonTextStyle: {
            color: themeColors.blueBgDark,
            fontWeight: "bold",
            fontSize: 14,
        },
        pickerBoard: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "stretch",
            borderWidth: 1.2,
            borderRadius: 4,
            marginTop: 10,
            color: themeColors.blueBgDark,
        },
        stepLabelText: { fontSize: 25, fontWeight: "bold" },
        picker: { height: 55, width: "100%", flexGrow: 1 },
        pickerQuestion: { fontSize: 15, fontWeight: "bold", paddingLeft: 6 },
        errorText: { color: themeColors.errorRed, paddingLeft: 15 },
    });

export const progressStepsStyle = {
    activeStepIconBorderColor: themeColors.blueBgDark,
    activeLabelColor: themeColors.blueBgDark,
    activeStepNumColor: themeColors.white,
    activeStepIconColor: themeColors.blueBgDark,
    completedStepIconColor: themeColors.blueBgDark,
    completedProgressBarColor: themeColors.blueBgDark,
    completedCheckColor: themeColors.white,
    labelFontSize: 3,
    activeLabelFontSize: 9,
    topOffset: 20,
    marginBottom: 10,
};

export const defaultScrollViewProps = {
    keyboardShouldPersistTaps: "handled",
    contentContainerStyle: {
        flex: 2,
        justifyContent: "center",
    },
};

export default useStyles;
