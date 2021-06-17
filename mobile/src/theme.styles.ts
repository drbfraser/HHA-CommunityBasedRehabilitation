import { DefaultTheme } from "react-native-paper";
import { themeColors } from "@cbr/common";
import { Theme as NavigationTheme } from "@react-navigation/native";

// https://callstack.github.io/react-native-paper/theming.html#typescript
declare global {
    namespace ReactNativePaper {
        // noinspection JSUnusedGlobalSymbols
        interface ThemeColors {
            /**
             * Color for text and icons displayed on top of the primary color.
             */
            onPrimary: string;
            /**
             * Used to present information to the user that is neutral and not necessarily important.
             * {@link https://material-ui.com/customization/palette/}
             */
            info: string;
        }
    }
}

const theme: ReactNativePaper.Theme & NavigationTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: themeColors.blueBgDark,
        onPrimary: themeColors.white,
        info: themeColors.infoBlue,
        accent: themeColors.yellow,
        border: DefaultTheme.colors.text,
        card: DefaultTheme.colors.surface,
    },
};

export default theme;
