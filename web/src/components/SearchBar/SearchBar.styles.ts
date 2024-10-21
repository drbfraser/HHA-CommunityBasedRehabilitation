// import { alpha } from "@mui/material/styles";
// import { themeColors } from "@cbr/common/util/colors";
// import { SxProps, Theme } from '@mui/material';

// todosd: remove, or make work...
// export const searchBarStyles: Record<string, SxProps<Theme>> = {
//     search: (theme: Theme) => ({
//         position: "relative",
//         borderRadius: 90,
//         backgroundColor: alpha(themeColors.blueBgDark, 0.15),
//         "&:hover": {
//             backgroundColor: alpha(themeColors.blueBgDark, 0.25),
//         },
//         marginLeft: 0,
//         [theme.breakpoints.up("sm")]: { // todo: check this, was [theme.breakpoints.up("sm")]:
//             marginLeft: theme.spacing(1),
//             width: "auto",
//         },
//     }),
//     searchIcon: {
//         padding: (theme) => theme.spacing(0, 2),
//         height: "100%",
//         position: "absolute",
//         pointerEvents: "none",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//     },
//     inputRoot: {
//         color: "inherit",
//     },
//     inputInput: {
//         padding: (theme) => theme.spacing(1, 1, 1, 0),
//         // vertical padding + font size from searchIcon
//         paddingLeft: (theme) => `calc(1em + ${theme.spacing(4)})`,
//         transition: (theme) => theme.transitions.create("width"),
//         width: "12ch",
//         "&:focus": {
//             width: "20ch",
//         },
//     },
// }


// todo: remove
// export const useStyles = makeStyles(
//     (theme) => ({
//         search: {
//             position: "relative",
//             borderRadius: 90,
//             backgroundColor: alpha(themeColors.blueBgDark, 0.15),
//             "&:hover": {
//                 backgroundColor: alpha(themeColors.blueBgDark, 0.25),
//             },
//             marginLeft: 0,
//             [theme.breakpoints.up("sm")]: {
//                 marginLeft: theme.spacing(1),
//                 width: "auto",
//             },
//         },
//         searchIcon: {
//             padding: theme.spacing(0, 2),
//             height: "100%",
//             position: "absolute",
//             pointerEvents: "none",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//         },
//         inputRoot: {
//             color: "inherit",
//         },
//         inputInput: {
//             padding: theme.spacing(1, 1, 1, 0),
//             // vertical padding + font size from searchIcon
//             paddingLeft: `calc(1em + ${theme.spacing(4)})`,
//             transition: theme.transitions.create("width"),
//             width: "12ch",
//             "&:focus": {
//                 width: "20ch",
//             },
//         },
//     }),
//     { index: 1 }
// );
