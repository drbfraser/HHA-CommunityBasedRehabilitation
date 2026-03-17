import { SxProps, Theme } from "@mui/material";

export const storyFormStyles: Record<string, SxProps<Theme>> = {
    sectionTitle: {
        mt: 3,
        mb: 1,
        fontWeight: "bold",
    },
    helperText: {
        mb: 2,
        fontStyle: "italic",
        color: "text.secondary",
        fontSize: "0.85rem",
    },
    photoPreview: {
        maxWidth: 300,
        maxHeight: 300,
        objectFit: "contain" as const,
        borderRadius: 1,
        mt: 1,
        mb: 1,
    },
};
