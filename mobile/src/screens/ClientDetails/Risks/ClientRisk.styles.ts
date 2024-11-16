import { StyleSheet } from "react-native";

const useStyles = () =>
    StyleSheet.create({
        riskCardStyle: {
            display: "flex",
            rowGap: 30,
            alignItems: "center",
            justifyContent: "space-between",
            marginVertical: 30,
            paddingVertical: 15,
            borderRadius: 20,
        },
        riskCardContentStyle: {
            height: 80,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: 350,
            marginBottom: 20,
        },
        riskTitleStyle: {
            marginVertical: 10,
            fontSize: 32,
            justifyContent: "center",
            fontWeight: "bold",
        },
        riskHeaderStyle: {
            fontSize: 20,
            fontWeight: "bold",
            alignSelf: "flex-start",
        },
        riskRequirementStyle: {
            fontSize: 16,
            marginHorizontal: 20,
            marginBottom: 30,
            justifyContent: "flex-start",
        },

        modalUpdateButton: {
            padding: 5,
            marginBottom: 15,
            borderRadius: 5,
        },
        modalStyle: {
            padding: 25,
            marginHorizontal: 20,
            borderRadius: 10,
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            gap: 20,
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
        menuField: {
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            width: "100%",
            gap: 20,
        },
        radioIndividual: {
            alignItems: "center",
        },
        submitButtonStyle: {
            marginTop: 20,
            width: "100%",
        },
    });

export default useStyles;

export const riskStyles = (textColour: string) =>
    StyleSheet.create({
        riskSubtitleStyle: {
            fontWeight: "bold",
            height: 50,
            padding: 14,
            fontSize: 18,
            color: textColour,
            borderColor: textColour,
            borderRadius: 5,
            borderWidth: 1,
        },
        riskRadioStyle: {
            fontWeight: "bold",
            height: 55,
            width: 55,
            padding: 14,
            fontSize: 16,
            alignItems: "center",
            alignContent: "center",
            justifyContent: "center",
            display: "flex",
            flexDirection: "row",
            color: textColour,
            borderColor: textColour,
            borderRadius: 5,
            borderWidth: 1,
        },
        radioSubtitleText: {
            color: textColour,
        },
    });
