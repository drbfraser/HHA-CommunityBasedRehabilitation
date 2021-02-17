import { fade, makeStyles } from "@material-ui/core/styles";
import { themeColors } from "theme.styles";

export const useStyles = makeStyles((theme) => ({
    search: {
        position: "relative",
        borderRadius: 90,
        backgroundColor: fade(themeColors.blueBgDark, 0.15),
        "&:hover": {
            backgroundColor: fade(themeColors.blueBgDark, 0.25),
        },
        marginLeft: 0,
        [theme.breakpoints.up("sm")]: {
            marginLeft: theme.spacing(1),
            width: "auto",
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: "100%",
        position: "absolute",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    inputRoot: {
        color: "inherit",
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create("width"),
        width: "12ch",
        "&:focus": {
            width: "20ch",
        },
    },
}));
