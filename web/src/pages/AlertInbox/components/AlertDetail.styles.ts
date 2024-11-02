import { SxProps, Theme } from "@mui/material";

export const alertDetailStyles: Record<string, SxProps<Theme>> = {
    dividerStyle: {
        backgroundColor: "grey",
        height: "3px",
    },
    deleteButtonStyle: {
        bottom: 0,
        position: "absolute",
    },
    detailContainerStyle: {
        position: "relative",
        minHeight: "300px",
    },
};
