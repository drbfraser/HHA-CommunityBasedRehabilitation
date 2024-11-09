import { SxProps, Theme } from "@mui/material";

export const alertListStyles: Record<string, SxProps<Theme>> = {
    list: {
        width: "100%",
        maxWidth: 360,
        bgcolor: "background.paper",
        overflow: "auto",
    },
    alertSubject: {
        display: "inline",
        paddingRight: 1,
        fontSize: 18,
    },
    alertInfoText: {
        display: "inline",
        fontSize: 14,
    },
};
