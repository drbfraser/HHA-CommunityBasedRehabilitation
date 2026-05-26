import { SxProps, Theme } from "@mui/material";

export const alertDetailStyles: Record<string, SxProps<Theme>> = {
    dividerStyle: {
        backgroundColor: "grey",
    },
    alertBodyStyle: {
        display: "flex",
        flexDirection: "column",
        minHeight: 250,
    },
    deleteButtonStyle: {
        marginTop: 2,
        alignSelf: "flex-start",
    },
    detailContainerStyle: {
        display: "flex",
        flexDirection: "column",
    },
};
