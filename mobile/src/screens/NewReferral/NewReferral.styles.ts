import { ScrollViewProps, StyleSheet } from "react-native";
import { themeColors } from "@cbr/common";

const useStyles = () =>
    StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            marginHorizontal: 10,
        },
        formContainer: {
            marginTop: 20,
        },
        uploadImageContainer: {
            flex: 1,
            position: "relative",
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
        checkBoxText: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 10,
            paddingRight: 50,
        },
        uploadButton: {
            marginBottom: 10,
            alignSelf: "stretch",
            alignItems: "center",
            backgroundColor: "#DDDDDD",
            padding: 12,
            borderRadius: 5,
        },
        buttonTextStyle: {
            color: themeColors.blueBgDark,
            fontWeight: "bold",
            fontSize: 14,
        },
        errorAlert: {
            marginVertical: 10,
        },
        alertText: {
            color: themeColors.hhaBlue,
        },
        row: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 8,
            paddingHorizontal: 16,
        },
        stepLabelText: { fontSize: 25, fontWeight: "bold" },
        picker: { height: 40, width: 250 },
        question: { fontSize: 15, fontWeight: "bold", paddingLeft: 6 },
        uploadHintContainer: {
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: "#F2F2F2",
            borderRadius: 12,
            position: "absolute",
            left: 16,
            right: 16,
            top: "40%",
        },
        uploadHintText: {
            textAlign: "center",
        },
        errorText: { color: themeColors.errorRed, paddingLeft: 15 },
        hipWidthInput: {
            backgroundColor: "transparent",
            paddingHorizontal: 10,
            width: 50,
        },
        hipWidthContainer: { flexDirection: "row", alignItems: "center" },
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
