import { SxProps, Theme } from "@mui/material";

export const searchOptionsStyles: Record<string, SxProps<Theme>> = {
    searchOptions: {
        verticalAlign: "top",
        display: "inline-block",
        paddingRight: "2px",
        "& .MuiSelect-root": {
            minWidth: "43px",
        },
    },
    zoneOptions: {
        minWidth: "175px",
    },
};
