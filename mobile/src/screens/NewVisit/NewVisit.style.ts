import { ScrollViewProps, StyleSheet } from "react-native";
import { themeColors } from "@cbr/common";

const useStyles = () =>
    StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            marginHorizontal: 10,
        },
        uploadImageContainer: {
            flex: 1,
        },
        centerImageContainer: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 50,
        },
        image: {
            backgroundColor: themeColors.white,
            borderRadius: 30,
            resizeMode: "contain",
            width: "100%",
            height: "auto",
            aspectRatio: 1,
            marginTop: 10,
        },
        uploadButton: {
            marginBottom: 10,
            alignSelf: "stretch",
            alignItems: "center",
            backgroundColor: "#DDDDDD",
            padding: 12,
            borderRadius: 5,
        },
        verticalSpacer: {
            marginTop: 10,
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
        pickerQuestion: { fontSize: 15, fontWeight: "bold", marginTop: 10 },
        normalInput: { fontSize: 15, paddingBottom: 10 },
        viewPadding: { paddingLeft: 10, paddingRight: 10 },
        inputText: {
            borderWidth: 1,
            marginLeft: 5,
            marginTop: 5,
        },
        errorAlert: { marginVertical: 10 },
        errorText: { color: themeColors.helperTextRed, paddingLeft: 12 },
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
    marginBottom: 0,
};

export const defaultScrollViewProps: Partial<ScrollViewProps> = {
    keyboardShouldPersistTaps: "handled",
    contentContainerStyle: {
        flex: 2,
        justifyContent: "center",
    },
};

export default useStyles;
