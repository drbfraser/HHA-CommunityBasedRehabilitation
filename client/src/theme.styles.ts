import { createMuiTheme } from "@material-ui/core";

export const themeColors = {
    blueBgLight: "#e3e8f4",
    blueBgDark: "#273364",
    yellow: "rgb(255, 199, 120)",
    yellowDark: "rgb(240, 160, 80)",
};

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
    },
    palette: {
        background: {
            default: themeColors.blueBgDark,
        },
        primary: {
            main: themeColors.blueBgDark,
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
