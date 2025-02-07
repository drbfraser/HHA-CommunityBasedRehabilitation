import { SxProps, Theme } from "@mui/material";

export const alertInboxStyles: Record<string, SxProps<Theme>> = {
    selectedListItemStyle: {
        backgroundColor: "lightcyan",
        border: "1px solid blue",
        padding: "5px",
        borderRadius: "3px",
    },
    listItemStyle: {
        padding: "3px",
    },
    gridStyle: {
        // border: "solid grey",
    },
    tableTopAndContentDividerStyle: {
        backgroundColor: "grey",
        // height: "3px",
    },
};
