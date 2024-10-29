import { SxProps, Theme } from "@mui/material";

export const priorityLevelChipStyles: Record<string, SxProps<Theme>> = {
    chip: {
        "& .MuiChip-label": {
            color: "white",
        },
    },
};

// todo: remove
// export const useStyles = makeStyles(
//     {
//         chip: {
//             "& .MuiChip-label": {
//                 color: "white",
//             },
//         },
//     },
//     { index: 1 }
// );
