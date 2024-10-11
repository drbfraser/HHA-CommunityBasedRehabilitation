import { makeStyles } from "@material-ui/core/styles";
import BackgroundImage from "./background.svg";
import BackgroundImageMobile from "./backgroundMobile.svg";

export const useStyles = makeStyles(
    {
        container: {
            height: "100%",

            backgroundRepeat: "no-repeat",
            backgroundImage: `url(${BackgroundImage})`,
            backgroundSize: "100% auto",
        },
        logo: {
            width: "100%",
            display: "block",
            paddingBottom: "2em",
        },
        formContainer: {
            maxWidth: 350,

            position: "absolute",
            top: "15%",
            right: "8%",

            display: "flex",
            flexDirection: "column",

            color: "white",
            "& .MuiInputLabel-root, & .MuiInput-input, & .MuiSelect-icon": {
                color: "white",
                "&.Mui-focused": {
                    color: "white",
                },
            },
            "& .MuiInput-underline, #language-picker-form .MuiInput-underline": {
                "&:hover:before, &:before": {
                    borderBottomColor: "white",
                },
            },
            "& .MuiInput-underline:after": {
                borderBottomColor: "white",
            },
        },
        loginForm: {
            display: "flex",
            flexDirection: "column",
            gap: "2em",
        },
        "@media (max-width: 600px)": {
            container: {
                backgroundImage: `url(${BackgroundImageMobile})`,
            },
            formContainer: {
                margin: "0 auto",
                top: "25%",
                left: 0,
                right: 0,
            },
        },
    },
    { index: 1 }
);
