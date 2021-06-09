import { createMuiTheme } from "@material-ui/core";
import { themeColors } from "common";

export const mediaMobile = "@media (max-width: 800px)";

export const themeMui = createMuiTheme({
    overrides: {
        MuiCssBaseline: {
            "@global": {
                "html, body, #root": {
                    height: "100%",
                },
                "#root": {
                    minHeight: "100%",
                },
            },
        },
        MuiLink: {
            root: {
                color: themeColors.linkBlue,
                textDecoration: "underline",
            },
        },
    },
    palette: {
        background: {
            default: themeColors.blueBgDark,
        },
        primary: {
            main: themeColors.blueBgDark,
        },
        secondary: {
            main: themeColors.yellow,
            dark: themeColors.yellowDark,
        },
    },
    typography: {
        h1: {
            fontSize: "3.5rem",
        },
        h2: {
            fontSize: "2.75rem",
        },
        h3: {
            fontSize: "2rem",
        },
    },
});
