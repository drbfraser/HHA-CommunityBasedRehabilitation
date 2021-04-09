import { createMuiTheme } from "@material-ui/core";

export const mediaMobile = "@media (max-width: 800px)";

export const themeColors = {
    blueBgLight: "#e3e8f4",
    blueBgDark: "#273364",
    yellow: "rgb(250, 195, 90)",
    yellowDark: "rgb(240, 170, 80)",
    errorRed: "#f44336",
    riskRed: "#ef5350",
    riskGreen: "#81C784",
    riskYellow: "#f0aa50",
    riskBlack: "#424242",
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
