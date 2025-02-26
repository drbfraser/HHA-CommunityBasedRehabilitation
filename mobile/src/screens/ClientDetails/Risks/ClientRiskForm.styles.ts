import { StyleSheet } from "react-native";

const useStyles = () =>
    StyleSheet.create({
        modalUpdateButton: {
            padding: 5,
            borderRadius: 5,
        },
        modalStyle: {
            padding: 25,
            margin: 20,
            borderRadius: 10,
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
        },
        modalContentStyle: {
            gap: 20,
        },
        riskInputStyle: {
            width: 320,
        },
        riskModalStyle: {
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
            padding: 10,
        },
        riskHeaderStyle: {
            fontSize: 18,
            fontWeight: "bold",
        },
        menuField: {
            flexDirection: "row",
            justifyContent: "space-evenly",
            gap: 20,
        },
        radioIndividual: {
            alignItems: "center",
        },
        submitButtonStyle: {
            marginTop: 20,
        },
    });
export default useStyles;

export const riskRadioButtonStyles = (textColour: string) =>
    StyleSheet.create({
        riskRadioStyle: {
            fontWeight: "bold",
            height: 50,
            width: 55,
            fontSize: 16,
            alignItems: "center",
            justifyContent: "center",
            color: textColour,
            borderColor: textColour,
            borderRadius: 5,
            borderWidth: 1,
        },
        radioSubtitleText: {
            fontWeight: "bold",
            color: textColour,
        },
    });
