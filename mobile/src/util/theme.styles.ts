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
        }
    }
}

const theme: ReactNativePaper.Theme & NavigationTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: themeColors.blueBgDark,
        onPrimary: themeColors.white,
        accent: themeColors.yellow,
        border: DefaultTheme.colors.text,
        card: DefaultTheme.colors.surface,
    },
};

export default theme;

