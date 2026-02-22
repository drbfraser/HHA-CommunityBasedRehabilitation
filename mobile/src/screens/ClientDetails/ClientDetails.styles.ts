import { StyleSheet } from "react-native";
import { themeColors } from "@cbr/common";

const useStyles = () =>
    StyleSheet.create({
        container: {
            margin: 20,
        },
        imageContainer: {
            flexDirection: "row",
            justifyContent: "center",
        },
        clientDetailContainer: {
            flex: 1,
        },
        clientButtons: {
            padding: 3,
            marginTop: 3,
            marginBottom: 15,
            width: 256,
            borderRadius: 5,
        },
        clientCardContainerStyles: {
            marginTop: 10,
            alignItems: "center",
            borderRadius: 20,
        },
        clientCardImageStyle: {
            backgroundColor: themeColors.white,
            width: 256,
            height: 256,
            marginTop: 10,
            marginBottom: 10,
            shadowColor: "#FFFFFF",
            borderRadius: 30,
            overflow: "hidden",
        },
        clientDetailsContainerStyles: {
            marginTop: 20,
            marginBottom: 20,
            paddingBottom: 15,
            paddingTop: 15,
            alignItems: "center",
            borderRadius: 20,
            flexShrink: 1,
        },
        scrollViewStyles: {
            marginHorizontal: 5,
        },
        clientDetailsFinalView: {
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            flexDirection: "row",
            marginTop: 15,
            marginBottom: 15,
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
        riskTitleStyle: {
            marginTop: 10,
            fontSize: 32,
            justifyContent: "center",
            fontWeight: "bold",
            color: themeColors.textGray,
        },
        cardSectionTitle: {
            textAlign: "center",
            marginTop: 14,
            marginBottom: 14,
            fontSize: 32,
            color: themeColors.textGray,
        },
        previousGoalsButtonContainer: {
            alignItems: "center",
            marginTop: 12,
            marginBottom: 2,
        },
        previousGoalsButton: {
            borderRadius: 6,
            minWidth: 220,
        },
        archiveWarningStyle: {
            width: 250,
            textAlign: "center",
            justifyContent: "center",
        },
        activityCardContentStyle: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            height: 110,
            width: 350,
            marginTop: 15,
        },
        loadingContainer: {
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            marginTop: 300,
        },
        patientNoteCard: {
            marginTop: 10,
            marginBottom: 10,
            paddingHorizontal: 16,
            paddingVertical: 16,
            borderRadius: 20,
        },
        patientNoteTitleRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
        },
        patientNoteTitle: {
            fontSize: 24,
            fontWeight: "bold",
            color: themeColors.textGray,
        },
        patientNoteButtonRow: {
            flexDirection: "row",
            gap: 8,
        },
        patientNoteButton: {
            borderRadius: 5,
        },
        patientNoteDisplayBox: {
            padding: 16,
            backgroundColor: "#fafafa",
            borderRadius: 8,
            minHeight: 60,
            borderWidth: 1,
            borderColor: "#e0e0e0",
        },
        patientNoteText: {
            fontSize: 14,
            color: "#333",
        },
    });

export default useStyles;
