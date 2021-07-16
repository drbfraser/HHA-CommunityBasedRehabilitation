import { themeColors } from "@cbr/common";
import { StyleSheet } from "react-native";

const useStyles = () =>
    StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            marginLeft: 15,
            marginRight: 15,
        },
        nextButton: {
            position: "absolute",
            right: -50,
            bottom: -10,
            padding: -1,
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
        alertText: {
            color: themeColors.hhaBlue,
        },
        stepLabelText: { fontSize: 25, fontWeight: "bold" },
        centerElement: { justifyContent: "center", alignItems: "center" },
        picker: { height: 40, width: 250 },
        pickerQuestion: { fontSize: 15, fontWeight: "bold", paddingLeft: 6 },
        normalInput: { fontSize: 15, paddingBottom: 0, paddingLeft: 5 },
        viewPadding: { paddingLeft: 10, paddingRight: 10 },
        inputText: {
            borderWidth: 1,
            marginLeft: 5,
            marginTop: 5,
        },

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
