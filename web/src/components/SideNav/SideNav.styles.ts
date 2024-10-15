import { themeColors } from "@cbr/common/util/colors";
import { SxProps, Theme } from '@mui/material';

// todo: replace "@media (max-width: 800px)" with mediaMobile?
// import { mediaMobile } from "theme.styles";

export const sideNavStyles: Record<string, SxProps<Theme>> = {
    container: {
        display: "flex",
        flexDirection: "column",
        width: "100px", // todo: %?
        "@media (max-width: 800px)": { 
            flexDirection: "row",
            justifyContent: "space-evenly",
            width: "100%",
        },
    },
    icon: {
        margin: "10px auto",
        height: "55px",
        width: "55px",
        borderRadius: "20px",
        textAlign: "center",
        fontSize: 42,
        cursor: "pointer",
        color: "white",
        "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.3)",
        },
    },
    active: {
        "&, &:hover": {
            backgroundColor: themeColors.yellow,
        },
    },
    tooltip: {
        fontSize: 14,
        "&, & .MuiTooltip-arrow:before": {
            backgroundColor: "black",
        },
    },
    hhaIcon: {
        margin: "10px auto 30px auto",
        borderRadius: "20px",
        height: "75px",
        width: "75px",
        padding: "10px",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        "@media (max-width: 800px)": {
            display: "none",
        }
    },
    notificationBadge: {
        justifyContent: "center",
        "& .MuiBadge-badge": {
            right: "20px",
            top: "15px",
        },
        "@media (max-width: 800px)": {
            "& .MuiBadge-badge": {
                right: "10px",
            },
        }
    },
}


// todo: remove
// export const useStyles = makeStyles(
//     {
//         container: {
//             display: "flex",
//             flexDirection: "column",
//             width: 100,
//         },
//         icon: {
//             margin: "10px auto",
//             height: 55,
//             width: 55,
//             borderRadius: 20,
//             textAlign: "center",
//             fontSize: 42,
//             cursor: "pointer",
//             color: "white",
//             "&:hover": {
//                 backgroundColor: "rgba(255, 255, 255, 0.3)",
//             },
//         },
//         active: {
//             "&, &:hover": {
//                 backgroundColor: themeColors.yellow,
//             },
//         },
//         tooltip: {
//             fontSize: 14,
//             "&, & .MuiTooltip-arrow:before": {
//                 backgroundColor: "black",
//             },
//         },
//         hhaIcon: {
//             margin: "10px auto 30px auto",
//             borderRadius: 20,
//             height: 75,
//             width: 75,
//             padding: 10,
//             backgroundColor: "rgba(255, 255, 255, 0.1)",
//         },
//         notificationBadge: {
//             justifyContent: "center",
//             "& .MuiBadge-badge": {
//                 right: 20,
//                 top: 15,
//             },
//         },
//         "@media (max-width: 800px)": { // todo: note, = [mediaMobile]
//             container: {
//                 flexDirection: "row",
//                 justifyContent: "space-evenly",
//                 width: "100%",
//             },
//             hhaIcon: {
//                 display: "none",
//             },
//             notificationBadge: {
//                 "& .MuiBadge-badge": {
//                     right: 10,
//                 },
//             },
//         },
//     },
//     { index: 1 }
// );
