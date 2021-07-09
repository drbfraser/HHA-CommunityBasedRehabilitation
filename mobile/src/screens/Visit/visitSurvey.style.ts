import { themeColors } from "@cbr/common";
import { StyleSheet } from "react-native";

const useStyles = () =>
    StyleSheet.create({
        container: {
            flex: 1,
            // alignItems: "center",
            justifyContent: "center",
            marginLeft: 10,
            marginRight: 10,
        },
        nextButton: {
            position: "absolute",
            right: -45,
            bottom: 0,
            padding: -1,
        },
        prevButton: {
            position: "absolute",
            left: -45,
            bottom: 0,
            padding: -1,
        },
        buttonTextStyle: {
            color: themeColors.blueBgDark,
            fontWeight: "bold",
            fontSize: 14,
        },
        checkBoxText: {
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            paddingVertical: 10,
            paddingRight: 50,
        },
        alertText: {
            color: themeColors.hhaBlue,
        },
        centerElement: { justifyContent: "center", alignItems: "center" },
        picker: { height: 40, width: 250 },
        pickerQuestion: { fontSize: 15, fontWeight: "bold", paddingBottom: 0, paddingLeft: 7 },
        normalInput: { fontSize: 15, paddingBottom: 0, paddingLeft: 7 },
        viewPadding: { paddingLeft: 10, paddingRight: 10 },
        inputText: {
            borderWidth: 1,
            borderColor: "#000000",
            borderRadius: 5,
            paddingLeft: 10,
        },
    });

export const progressStepsStyle = {
    activeStepIconBorderColor: themeColors.blueBgDark,
    activeLabelColor: themeColors.blueBgDark,
    activeStepNumColor: themeColors.white,
    activeStepIconColor: themeColors.blueBgDark,
    completedStepIconColor: themeColors.blueBgDark,
    completedProgressBarColor: themeColors.blueBgDark,
    completedCheckColor: themeColors.white,
    topOffset: 20,
    marginBottom: 15,
};

export const defaultScrollViewProps = {
    keyboardShouldPersistTaps: "handled",
    contentContainerStyle: {
        flex: 2,
        justifyContent: "center",
    },
};

export default useStyles;
