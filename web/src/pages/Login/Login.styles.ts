import BackgroundImage from "./background.svg";
import BackgroundImageMobile from "./backgroundMobile.svg";
import { SxProps, Theme } from "@mui/material";

/* OPTION 1: explicitly type, but need to be explicity about CSSProperties */
export const loginStyles: Record<string, SxProps<Theme> | React.CSSProperties> = {
    container: {
        height: "100vh",
        backgroundRepeat: "no-repeat",
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: "100% auto",

        "@media (max-width: 600px)": {
            backgroundImage: `url(${BackgroundImageMobile})`,
        },
    },
    logo: {
        display: "block",
        width: "100%",
        paddingBottom: "2em",
    },
    formContainer: {
        maxWidth: "350px",

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
        "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
            borderBottomColor: "white",
        },

        "@media (max-width: 600px)": {
            margin: "0 auto",
            top: "25%",
            left: 0,
            right: 0,
        },
    },
    loginForm: {
        display: "flex",
        flexDirection: "column",
        gap: "2em",
    } as React.CSSProperties,
};

// todosd: remove
// export const useStyles = makeStyles(
//     {
//         container: {
//             height: "100%",
//             backgroundRepeat: "no-repeat",
//             backgroundImage: `url(${BackgroundImage})`,
//             backgroundSize: "100% auto",
//         },
//         logo: {
//             display: "block",
//             width: "100%",
//         },
//         formContainer: {
//             maxWidth: 350,
//             position: "absolute",
//             top: "15%",
//             right: "8%",
//             color: "white",
//             "& .MuiInputLabel-root, & .MuiInput-input": {
//                 color: "white",
//             },
//             "& .MuiInput-underline": {
//                 "&:hover:before, &:before": {
//                     borderBottomColor: "white",
//                 },
//             },
//             "& .MuiInput-underline:after": {
//                 borderBottomColor: "white",
//             },
//         },
//         "@media (max-width: 600px)": {
//             container: {
//                 backgroundImage: `url(${BackgroundImageMobile})`,
//             },
//             formContainer: {
//                 margin: "0 auto",
//                 top: "25%",
//                 left: 0,
//                 right: 0,
//             },
//         },
//     },
//     { index: 1 }
// );
