import { SxProps, Theme } from "@mui/material";

export const clientRiskStyles: Record<string, SxProps<Theme>> = {
    riskCardButtonAndBadge: {
        float: "right",
    },
    riskCardContainer: {
        marginLeft: "10px",
        marginRight: "10px",
        width: "100%",
    },
};

// todosd: remove
// export const useStyles = makeStyles(
//     {
//         riskCardButtonAndBadge: {
//             float: "right",
//         },
//         riskCardContainer: {
//             marginLeft: "10px",
//             marginRight: "10px",
//             width: "100%",
//         },
//     },
//     { index: 1 }
// );
