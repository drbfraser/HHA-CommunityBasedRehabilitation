import { themeColors } from "@cbr/common/util/colors";
import { createTheme } from "@mui/material";

export const mediaMobile = "@media (max-width: 800px)";

// todosd: reset body font size here? https://mui.com/material-ui/migration/v5-component-changes/ @Update body font size
export const themeMui = createTheme({
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                html: {
                    height: "100%",
                    // border: "5px solid red", // todosd: remove
                },
                body: {
                    height: "100%",
                    // border: "5px solid red", // todosd: remove
                },
                root: {
                    height: "100%",
                    minHeight: "100%",
                    // border: "5px solid red", // todosd: remove
                },

                // todosd: confirm this is equivalent
                // "@global": {
                //     "html, body, #root": {
                //         height: "100%",
                //     },
                //     "#root": {
                //         minHeight: "100%", // todosd: vh?
                //     },
                // },
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    color: themeColors.linkBlue,
                    textDecoration: "underline",
                    // border: "5px solid red", // todosd: test
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
