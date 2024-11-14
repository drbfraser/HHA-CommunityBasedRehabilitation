import { themeColors } from "@cbr/common";
import { StyleSheet } from "react-native";

const useStyles = () =>
    StyleSheet.create({
        cardSectionTitle: {
            textAlign: "center",
            marginTop: 14,
            marginBottom: 14,
            fontSize: 32,
        },
        riskCardStyle: {
            display: "flex",
            justifyContent: "space-between",
            marginTop: 20,
            marginBottom: 20,
            paddingBottom: 15,
            paddingTop: 15,
            alignItems: "center",
            borderRadius: 20,
        },
        riskCardContentStyle: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            height: 70,
            width: 350,
            marginTop: 15,
        },
        riskTitleStyle: {
            marginTop: 10,
            marginLeft: 10,
            fontSize: 32,
            justifyContent: "center",
            fontWeight: "bold",
            //Add colour here
        },
        riskHeaderStyle: {
            fontSize: 20,
            fontWeight: "bold",
            alignSelf: "flex-start",
        },
        riskRequirementStyle: {
            fontSize: 16,
            marginLeft: 20,
            marginRight: 20,
            justifyContent: "flex-start",
        },
        clientDetailsFinalView: {
            alignItems: "center",
            justifyContent: "flex-end",
            display: "flex",
            flexDirection: "row",
            height: 40,
            width: 350,
            marginTop: 15,
            marginBottom: 15,
        },
        modalUpdateButton: {
            padding: 3,
            marginTop: 3,
            marginBottom: 15,
            marginLeft: 10,
            marginRight: 10,
            width: 112,
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
            width: "100%",
        },
    });

export default useStyles;

export const riskStyles = (textColour: string) =>
    StyleSheet.create({
        riskSubtitleStyle: {
            fontWeight: "bold",
            height: "auto",
            width: "auto",
            padding: 14,
            fontSize: 18,
            alignItems: "center",
            justifyContent: "flex-end",
            display: "flex",
            flexDirection: "row",
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
