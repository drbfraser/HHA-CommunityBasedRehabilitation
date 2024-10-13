import makeStyles from '@mui/styles/makeStyles';
import { SxProps, Theme } from '@mui/material';

export const priorityLevelChipStyles: Record<string, SxProps<Theme>> = {
    chip: {
        "& .MuiChip-label": {
            color: "white",
        },
    },
}

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
