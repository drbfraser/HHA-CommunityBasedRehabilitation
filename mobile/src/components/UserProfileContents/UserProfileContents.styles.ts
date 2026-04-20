import { StyleSheet } from "react-native";
import { themeColors } from "@cbr/common";

const useStyles = () => {
    return StyleSheet.create({
        container: {
            marginTop: 30,
            marginHorizontal: 30,
            flex: 1,
        },
        loadingContainer: {
            flexDirection: "column",
        },
        profileInfoContainer: {
            flex: 1,
        },
        successAlert: {
            marginBottom: 12,
        },
        userFirstLastNameTitle: {
            marginVertical: 15,
            fontSize: 24,
            fontWeight: "bold",
        },
        profileInfoRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
            marginBottom: 8,
        },
        profileInfoHeader: {
            fontWeight: "bold",
            fontSize: 16,
            marginBottom: 0,
            flexShrink: 0,
        },
        profileInfoText: {
            fontSize: 16,
            textAlign: "right",
            flex: 1,
            flexShrink: 1,
        },
        button: {
            marginVertical: 5,
        },
        bugReportCard: {
            marginTop: 10,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: "#cfdaf2",
            borderRadius: 10,
            shadowColor: "#273364",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 6,
            elevation: 1,
            backgroundColor: themeColors.white,
        },
        bugReportCardContent: {
            paddingBottom: 4,
        },
        bugReportTitle: {
            fontSize: 19,
            fontWeight: "700",
        },
        bugReportDescription: {
            marginTop: 4,
            fontSize: 14,
        },
        bugReportCardActions: {
            justifyContent: "center",
            paddingHorizontal: 14,
            paddingTop: 14,
            paddingBottom: 14,
        },
        bugReportButton: {
            borderRadius: 8,
        },
        bugReportButtonContent: {
            paddingHorizontal: 14,
            paddingVertical: 6,
        },
    });
};

export default useStyles;
