import { SxProps, Theme } from '@mui/material';

export const hideColumnsStyles: Record<string, SxProps<Theme>> = {
    optionsContainer: {
        padding: "5px",
    },
    optionsButton: {
        padding: "6px",
        verticalAlign: "middle",
    },
    optionsRow: {
        padding: "2px 0px 2px 0px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
    },
}

// todosd: remove
// export const useHideColumnsStyles = makeStyles(
//     {
//         optionsContainer: {
//             padding: "5px",
//         },
//         optionsButton: {
//             padding: "6px",
//             verticalAlign: "middle",
//         },
//         optionsRow: {
//             padding: "2px 0px 2px 0px",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             width: "100%",
//         },
//     },
//     { index: 1 }
// );
