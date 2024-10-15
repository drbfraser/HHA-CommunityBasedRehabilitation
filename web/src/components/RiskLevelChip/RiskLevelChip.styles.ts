import { SxProps, Theme } from '@mui/material';

export const riskLevelChipStyles: Record<string, SxProps<Theme>> = {
    chip: {
        "& .MuiChip-label": {
            color: "white",
        },
    },
}

// todo: delete
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
