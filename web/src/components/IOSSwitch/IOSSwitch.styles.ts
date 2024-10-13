import { themeColors } from "@cbr/common/util/colors";
import { SxProps, Theme } from '@mui/material';

export const iOSSwitchStyles: Record<string, SxProps<Theme>> = {
    root: {
        width: "42px",
        height: "26px",
        padding: 0,
        marginLeft: "5px",
        marginRight: "5px",
    },
    switchBase: {
        padding: 1,
        "&$checked": {
            transform: "translateX(16px)",
            color: "white",
            "& + $track": {
                backgroundColor: themeColors.yellow,
                opacity: 1,
                border: "none",
            },
        },
    },
    thumb: {
        marginTop: "1px",
        width: "22px",
        height: "22px",
    },
    track: {
        borderRadius: "13px", // todo: was 26 / 2?
        opacity: 1,
        backgroundColor: themeColors.yellow,
    },
    checked: {},
    focusVisible: {},
}

// export const useStyles = makeStyles(
//     {
//         root: {
//             width: 42,
//             height: 26,
//             padding: 0,
//             marginLeft: 5,
//             marginRight: 5,
//         },
//         switchBase: {
//             padding: 1,
//             "&$checked": {
//                 transform: "translateX(16px)",
//                 color: "white",
//                 "& + $track": {
//                     backgroundColor: themeColors.yellow,
//                     opacity: 1,
//                     border: "none",
//                 },
//             },
//         },
//         thumb: {
//             marginTop: 1,
//             width: 22,
//             height: 22,
//         },
//         track: {
//             borderRadius: 26 / 2,
//             opacity: 1,
//             backgroundColor: themeColors.yellow,
//         },
//         checked: {},
//         focusVisible: {},
//     },
//     { index: 1 }
// );
