import { SxProps, Theme } from "@mui/material";

export const newVisitStyles: Record<string, SxProps<Theme>> = {
    visitLocationContainer: {
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
    },
    visitLocation: {
        flex: "1",
        minWidth: "200px",
        marginRight: "10px",
        marginTop: "10px",
    },
};
