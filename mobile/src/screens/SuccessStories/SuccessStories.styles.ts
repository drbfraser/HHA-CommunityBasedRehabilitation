import { StyleSheet, Dimensions } from "react-native";
import { themeColors } from "@cbr/common";

const { height } = Dimensions.get("window");

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: themeColors.textGray,
    },
    subtitle: {
        fontSize: 13,
        color: "#757575",
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 15,
        color: "#757575",
        textAlign: "center",
        marginTop: 40,
    },
    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 80,
    },
    errorAlert: {
        backgroundColor: "#feebee",
        padding: 12,
        borderRadius: 6,
        marginBottom: 16,
    },
    errorText: {
        color: "#d32f2f",
        fontSize: 14,
    },

    // List card
    storyCard: {
        marginBottom: 12,
        borderRadius: 10,
        backgroundColor: "#fff",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
    },
    storyCardContent: {
        padding: 14,
    },
    storyCardTitleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6,
    },
    storyCardTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        flex: 1,
        marginRight: 8,
    },
    storyCardMeta: {
        fontSize: 13,
        color: "#757575",
    },
    chipReady: {
        backgroundColor: "#e8f5e9",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: "flex-start" as const,
    },
    chipWIP: {
        backgroundColor: "#fff3e0",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: "flex-start" as const,
    },
    chipText: {
        fontSize: 11,
        fontWeight: "600" as const,
    },

    // View screen
    viewContainer: {
        padding: 16,
        paddingBottom: 32,
    },
    viewTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 4,
    },
    viewEditButton: {
        borderRadius: 6,
    },
    card: {
        marginTop: 16,
        borderRadius: 10,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: themeColors.textGray,
        marginBottom: 10,
    },
    fieldRow: {
        marginBottom: 10,
    },
    fieldLabel: {
        fontSize: 12,
        color: "#757575",
        marginBottom: 2,
    },
    fieldValue: {
        fontSize: 15,
        color: "#333",
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#333",
        marginTop: 20,
        marginBottom: 6,
    },
    sectionBody: {
        fontSize: 15,
        color: "#333",
        lineHeight: 22,
    },
    photoContainer: {
        marginTop: 20,
    },
    photo: {
        width: "100%",
        height: 300,
        borderRadius: 8,
        marginTop: 8,
    },
    timestampText: {
        fontSize: 12,
        color: "#9e9e9e",
        marginTop: 8,
    },

    // Form screen
    formContainer: {
        padding: 16,
        paddingBottom: 40,
    },
    formSectionTitle: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#333",
        marginTop: 20,
        marginBottom: 4,
    },
    formHelperText: {
        fontSize: 13,
        color: "#757575",
        marginBottom: 8,
    },
    formInput: {
        marginBottom: 12,
        backgroundColor: "#fff",
    },
    formMultiline: {
        marginBottom: 12,
        backgroundColor: "#fff",
    },
    formButtonRow: {
        flexDirection: "row",
        marginTop: 24,
        gap: 12,
    },
    formSubmitButton: {
        flex: 1,
        borderRadius: 6,
    },
    formCancelButton: {
        flex: 1,
        borderRadius: 6,
    },
    photoPreview: {
        width: "100%",
        height: 200,
        borderRadius: 8,
        marginBottom: 8,
    },
    photoButtonRow: {
        flexDirection: "row",
        gap: 8,
        marginTop: 8,
    },
});
