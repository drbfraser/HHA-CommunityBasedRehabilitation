import { SxProps, Theme } from '@mui/material';

export const newReferralStyles: Record<string, SxProps<Theme>> = {
    fieldIndent: {
        paddingLeft: "9px",
    },
    hipWidth: {
        maxWidth: "160px",
    },
    inches: {
        verticalAlign: "sub",
    },
}

// todosd: remove
// export const useStyles = makeStyles(
//     {
//         fieldIndent: {
//             paddingLeft: "9px",
//         },
//         hipWidth: {
//             maxWidth: "160px",
//         },
//         inches: {
//             verticalAlign: "sub",
//         },
//     },
//     { index: 1 }
// );
