import { themeColors } from "@cbr/common/util/colors";
import { createTheme, adaptV4Theme } from "@mui/material";

export const mediaMobile = "@media (max-width: 800px)";

// todosd: reset body font size here? https://mui.com/material-ui/migration/v5-component-changes/ @Update body font size
// todosd: remove adaptV4Theme
export const themeMui = createTheme(adaptV4Theme({
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
}));
