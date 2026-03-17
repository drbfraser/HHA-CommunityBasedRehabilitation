import { themeColors } from "@cbr/common/util/colors";
import { SxProps, Theme } from "@mui/material";
import { mediaMobile } from "theme.styles";

export const bugReportStyles: Record<string, SxProps<Theme>> = {
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        maxWidth: "900px",
        margin: "0 auto",
    },
    card: {
        borderRadius: "18px",
        border: `1px solid ${themeColors.blueBgLight}`,
        boxShadow: "0 6px 18px rgba(39, 51, 100, 0.08)",
    },
    subheading: {
        marginBottom: "8px",
        fontWeight: 700,
    },
    descriptionField: {
        marginTop: "8px",
    },
    helperText: {
        marginTop: "10px",
        color: themeColors.textGray,
    },
    attachControls: {
        marginTop: "14px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        flexWrap: "wrap",
    },
    imageMeta: {
        marginTop: "10px",
        display: "flex",
    },
    imagePreview: {
        marginTop: "12px",
        width: "100%",
        maxWidth: "560px",
        maxHeight: "360px",
        objectFit: "contain",
        borderRadius: "12px",
        border: `1px solid ${themeColors.blueBgLight}`,
        backgroundColor: themeColors.white,
        [mediaMobile]: {
            maxHeight: "240px",
        },
    },
    cardActions: {
        display: "flex",
        justifyContent: "space-between",
        padding: "0 16px 16px 16px",
        [mediaMobile]: {
            flexDirection: "column",
            alignItems: "stretch",
            gap: "8px",
        },
    },
};
