import { themeColors } from "@cbr/common/util/colors";
import { createTheme } from "@mui/material";

export const mediaMobile = "@media (max-width: 800px)";

export const themeMui = createTheme({
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                html: {
                    height: "100%",
                },
                body: {
                    height: "100%",

                    // override default body font size to match material-ui 4 default
                    // see: https://mui.com/material-ui/migration/v5-component-changes/ @Update body font size
                    fontSize: "0.875rem",
                    lineHeight: 1.43,
                    letterSpacing: "0.01071em",
                },
                "#root": {
                    height: "100%",
                    minHeight: "100%",
                },
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    color: themeColors.linkBlue,
                    textDecoration: "underline",
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
