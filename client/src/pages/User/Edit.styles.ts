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
        p: {
            fontSize: 25,
            fontStyle: "bold",
        },
        head: {},
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
        box: {
            backgroundColor: themeColors.blueBgLight,
            borderRadius: "1ch",
            width: "100%",
            height: 35,
            border: "2px solid #e3e8f4",
            marginBottom: 10,
            marginTop: 10,
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
