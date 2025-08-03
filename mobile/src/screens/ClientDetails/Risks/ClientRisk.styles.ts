import { StyleSheet } from "react-native";

const useStyles = () =>
    StyleSheet.create({
        riskCardStyle: {
            display: "flex",
            margin: 10,
            padding: 10,
            borderRadius: 15,
            flex: 1,
        },
        riskCardContentStyle: {
            display: "flex",
            flexDirection: "column",
            alignSelf: "stretch",
            margin: 5,
            paddingVertical: 10,
            gap: 20,
        },
        riskCardHeaderStyle: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
        },
        riskTitleStyle: {
            fontSize: 24,
            fontWeight: "bold",
        },
        riskHeaderStyle: {
            fontSize: 18,
            fontWeight: "bold",
        },
        riskRequirementStyle: {
            fontSize: 16,
            justifyContent: "flex-start",
        },
    });

export default useStyles;

export const riskStyles = (textColour: string) =>
    StyleSheet.create({
        riskSubtitleStyle: {
            fontWeight: "bold",
            padding: 7,
            fontSize: 12,
            color: textColour,
            borderColor: textColour,
            borderRadius: 5,
            borderWidth: 1,
            alignSelf: "flex-start",
        },
    });
