// import { makeStyles } from "@material-ui/core/styles";

// export const useStyles = makeStyles(
//     {
//         fieldIndent: {
//             paddingLeft: "9px",
//         },
//         hipWidth: {
//             maxWidth: "160px",
//         },
//         inches: {
//             verticalAlign: "sub",
//         },
//     },
//     { index: 1 }
// );

import { themeColors } from "@cbr/common";
import { StyleSheet } from "react-native";

const useStyles = () =>
    StyleSheet.create({
        container: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 30,
            marginRight: 30,
        },
        fieldIndent: {
            paddingLeft: "9px",
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
        row: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 8,
            paddingHorizontal: 16,
        },
        stepLabelText: { fontSize: 25, fontWeight: "bold" },
        centerElement: { justifyContent: "center", alignItems: "center" },
        picker: { height: 40, width: 250 },
        pickerQuestion: { fontSize: 15, fontWeight: "bold", paddingLeft: 6 },
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
