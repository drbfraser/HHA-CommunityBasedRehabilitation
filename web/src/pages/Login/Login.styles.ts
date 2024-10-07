import makeStyles from '@mui/styles/makeStyles';
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
            display: "block",
            width: "100%",
        },
        formContainer: {
            maxWidth: 350,
            position: "absolute",
            top: "15%",
            right: "8%",
            color: "white",
            "& .MuiInputLabel-root, & .MuiInput-input": {
                color: "white",
            },
            "& .MuiInput-underline": {
                "&:hover:before, &:before": {
                    borderBottomColor: "white",
                },
            },
            "& .MuiInput-underline:after": {
                borderBottomColor: "white",
            },
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
