import { StyleSheet } from "react-native";

const useStyles = () =>
    StyleSheet.create({
        modalUpdateButton: {
            padding: 5,
            // marginBottom: 15,
            borderRadius: 5,
        },
        modalStyle: {
            padding: 25,
            margin: 20,
            borderRadius: 10,
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            // gap: 20,
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
            // alignSelf: "flex-start",
        },
        menuField: {
            flexDirection: "row",
            justifyContent: "space-evenly",
            // alignItems: "center",
            // width: "100%",
            gap: 20,
        },
        radioIndividual: {
            alignItems: "center",
        },
        submitButtonStyle: {
            marginTop: 20,
            // width: "100%",
        },
    });
export default useStyles;

export const riskStyles = (textColour: string) =>
    StyleSheet.create({
        // riskSubtitleStyle: {
        //     fontWeight: "bold",
        //     height: 50,
        //     padding: 14,
        //     fontSize: 18,
        //     color: textColour,
        //     borderColor: textColour,
        //     borderRadius: 5,
        //     borderWidth: 1,
        // },
        riskRadioStyle: {
            fontWeight: "bold",
            height: 50,
            width: 55,
            // padding: 14,
            fontSize: 16,
            alignItems: "center",
            // alignContent: "center",
            justifyContent: "center",
            // display: "flex",
            // flexDirection: "row",
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
