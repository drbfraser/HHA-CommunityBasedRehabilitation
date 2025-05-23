import { themeColors } from "@cbr/common/util/colors";
import { SxProps, Theme } from "@mui/material";
import { mediaMobile } from "theme.styles";

export const sideNavStyles: Record<string, SxProps<Theme>> = {
    container: {
        display: "flex",
        flexDirection: "column",
        width: "100px",
        [mediaMobile]: {
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
        [mediaMobile]: {
            display: "none",
        },
    },
    notificationBadge: {
        justifyContent: "center",
        "& .MuiBadge-badge": {
            right: "20px",
            top: "15px",
        },
        [mediaMobile]: {
            "& .MuiBadge-badge": {
                right: "10px",
            },
        },
    },
};
