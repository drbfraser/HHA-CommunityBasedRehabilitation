import { makeStyles } from "@material-ui/core/styles";
import { themeColors } from "theme.styles";

export const useStyles = makeStyles(
    {
        container: {
            backgroundColor: "white",
            margin: "auto",
            overflow: "hiden",
            padding: 60,
            borderRadius: "2.5ch",
        },
        head: {
            marginBottom: 0,
        },
        label: {
            fontWeight: "bold",
        },
        btn: {
            backgroundColor: "white",
            border: "none",
            color: themeColors.blueBgDark,
            padding: "12px 16px",
            fontSize: 16,
            borderRadius: "1.3ch",
            cursor: "pointer",
            "&:hover": {
                backgroundColor: themeColors.blueBgLight,
                color: themeColors.blueBgDark,
            },
        },
        edit: {
            float: "right",
            color: "white",
        },
    },
    { index: 1 }
);
