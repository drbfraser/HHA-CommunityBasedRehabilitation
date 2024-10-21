import BackgroundImage from "./background.svg";
import BackgroundImageMobile from "./backgroundMobile.svg";
import { SxProps, Theme } from '@mui/material';

export const clientListStyles: Record<string, SxProps<Theme>> = {
    container: {
        height: "100%",
        backgroundRepeat: "no-repeat",
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: "100% auto",
         // todosd: check this max-width relative to mediaMobile
        "@media (max-width: 600px)": { 
            backgroundImage: `url(${BackgroundImageMobile})`,
        }
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
        "@media (max-width: 600px)": {
            margin: "0 auto",
            top: "25%",
            left: 0,
            right: 0,
        }
    },
    // todosd: remove, this should be for sx only?  Talk to Harry
    // loginForm: {
    //     display: "flex",
    //     flexDirection: "column",
    //     gap: "2em",
    // },
}


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
