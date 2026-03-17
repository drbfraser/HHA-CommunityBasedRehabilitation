import { SxProps, Theme } from "@mui/material";

export const userStyles: Record<string, SxProps<Theme>> = {
    container: {
        paddingLeft: "20px",
    },
    header: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
    },
    changePasswordButton: {
        marginBottom: "20px",
    },
    headerActions: {
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
        justifyContent: "flex-end",
    },
    profileRow: {
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        marginBottom: "24px",
        maxWidth: "900px",
    },
    profileItem: {
        width: "100%",
        backgroundColor: "transparent",
        border: "none",
        borderRadius: 0,
        padding: 0,
    },
    profileText: {
        margin: 0,
        lineHeight: 1.7,
    },
    bugReportCard: {
        marginBottom: "20px",
        maxWidth: "560px",
        border: "1px solid #cfdaf2",
        boxShadow: "0 8px 20px rgba(39, 51, 100, 0.12)",
    },
    bugReportDescription: {
        marginTop: "6px",
    },
    bugReportCardActions: {
        justifyContent: "flex-end",
        padding: "0 16px 16px",
    },
    logOutButton: {
        display: "flex",
        justifyContent: "flex-end",
    },
};
