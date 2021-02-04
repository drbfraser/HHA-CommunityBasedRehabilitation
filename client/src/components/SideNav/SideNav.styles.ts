import { makeStyles } from "@material-ui/core/styles";
import { themeColors } from "theme.styles";

export const useStyles = makeStyles(
    {
        container: {
            display: "flex",
            flexDirection: "column",
            width: 100,
        },
        icon: {
            margin: "10px auto",
            height: 55,
            width: 55,
            borderRadius: 20,
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
            borderRadius: 20,
            height: 75,
            width: 75,
            padding: 10,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
        },
        "@media (max-width: 800px)": {
            container: {
                flexDirection: "row",
                justifyContent: "space-evenly",
                width: "100%",
            },
            hhaIcon: {
                display: "none",
            },
        },
    },
    { index: 1 }
);
