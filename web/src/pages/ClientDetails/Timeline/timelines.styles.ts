import { themeColors } from "@cbr/common/util/colors";
import { SxProps, Theme } from '@mui/material';

export const timelineStyles: Record<string, SxProps<Theme>> = {
    timeline: {
        paddingLeft: 0,
        paddingRight: 0,
    },
    entry: {
        margin: "10px",
        marginRight: 0,
        padding: "8px 10px",
        border: "1px solid #aaa",
        borderRadius: "5px",
        fontSize: "120%",
        "& .MuiChip-root": {
            margin: "2px 0",
        },
    },
    showMore: {
        margin: "10px",
        marginRight: 0,
        padding: "8px 10px",
        border: "1px solid #aaa",
        borderRadius: "5px",
        fontSize: "120%",
        "& .MuiChip-root": {
            margin: "2px 0",
        },
        backgroundColor: themeColors.blueBgDark,
    },
    showMoreClickable: {
        cursor: "pointer",
    },
    clickable: {
        cursor: "pointer",
        "&:hover": {
            backgroundColor: "#eee",
        },
    },
    date: {
        alignSelf: "center",
        flex: "none",
        width: "105px",
        paddingLeft: 0,
        whiteSpace: "nowrap",
    },
    hidden: {
        visibility: "hidden",
    },
}

// todo: remove
// export const useTimelineStyles = makeStyles(
//     {
//         timeline: {
//             paddingLeft: 0,
//             paddingRight: 0,
//         },
//         entry: {
//             margin: 10,
//             marginRight: 0,
//             padding: "8px 10px",
//             border: "1px solid #aaa",
//             borderRadius: 5,
//             fontSize: "120%",
//             "& .MuiChip-root": {
//                 margin: "2px 0",
//             },
//         },
//         showMore: {
//             margin: 10,
//             marginRight: 0,
//             padding: "8px 10px",
//             border: "1px solid #aaa",
//             borderRadius: 5,
//             fontSize: "120%",
//             "& .MuiChip-root": {
//                 margin: "2px 0",
//             },
//             backgroundColor: themeColors.blueBgDark,
//         },
//         showMoreClickable: {
//             cursor: "pointer",
//         },
//         clickable: {
//             cursor: "pointer",
//             "&:hover": {
//                 backgroundColor: "#eee",
//             },
//         },
//         date: {
//             alignSelf: "center",
//             flex: "none",
//             width: 105,
//             paddingLeft: 0,
//             whiteSpace: "nowrap",
//         },
//         hidden: {
//             visibility: "hidden",
//         },
//     },
//     { index: 1 }
// );
