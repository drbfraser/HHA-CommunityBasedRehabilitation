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
        btn: {
            backgroundColor: themeColors.blueBgDark,
            color: "white",
            border: "2px solid #e3e8f4",
            float: "right",
            margin: 10,
            width: 100,
            borderRadius: "1.5ch",
            padding: "12px 16px",
            fontSize: 16,
            cursor: "pointer",
            "&:hover": {
                backgroundColor: themeColors.blueBgLight,
                color: themeColors.blueBgDark,
            },
        },
        label: {
            fontWeight: "bold",
        },
        form: {
            marginBottom: 10,
            position: "relative",
            borderRadius: 5,
            "& textarea, & input[type='text'], & input[type='tel'], & input[type='email']": {
                padding: 15,
                width: "100%",
            },
        },
    },
    { index: 1 }
);
