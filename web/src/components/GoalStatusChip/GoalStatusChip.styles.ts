import { SxProps, Theme } from "@mui/material";

export const goalStatusChipStyles: Record<string, SxProps<Theme>> = {
    chip: {
        borderRadius: 0,
        "& .MuiChip-label": {
            color: "white",
        },
    },
};
