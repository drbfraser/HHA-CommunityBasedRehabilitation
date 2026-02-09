import { StyleSheet, Dimensions } from "react-native";

const { height } = Dimensions.get("window");

export const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "90%",
        maxWidth: 550,
        maxHeight: height * 0.8,
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,
    },
    title: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 16,
        color: "#000",
    },
    noteDisplayBox: {
        padding: 16,
        backgroundColor: "#f5f5f5",
        borderRadius: 4,
        marginBottom: 16,
        minHeight: 100,
        borderWidth: 1,
        borderColor: "#e0e0e0",
    },
    input: {
        borderWidth: 1,
        borderColor: "#bdbdbd",
        borderRadius: 4,
        padding: 12,
        marginBottom: 16,
        textAlignVertical: "top", 
        minHeight: 120,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    actionButtons: {
        flexDirection: "row",
    },
    historyContainer: {
        marginTop: 24,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
    },
    historyTitle: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
        color: "#757575",
    },
    historyItem: {
        marginBottom: 12,
    },
    historyNote: {
        fontSize: 14,
        color: "#333",
    },
    historyMeta: {
        fontSize: 12,
        color: "#757575",
        marginTop: 2,
    },
    errorAlert: {
        backgroundColor: "#feebee",
        padding: 8,
        borderRadius: 4,
        marginBottom: 16,
    },
    errorText: {
        color: "#d32f2f",
    },
});