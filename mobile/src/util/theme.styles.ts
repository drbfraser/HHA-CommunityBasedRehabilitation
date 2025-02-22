import { MD2LightTheme as DefaultTheme, useTheme } from "react-native-paper";
import { themeColors } from "@cbr/common";
import { DefaultTheme as NavigationTheme } from "@react-navigation/native";
import { ThemeProp } from "react-native-paper/lib/typescript/types";

type CustomTheme = ThemeProp &
    typeof NavigationTheme & {
        colors: typeof DefaultTheme.colors & {
            info: string;
            onPrimary: string;
        };
    };

const theme: CustomTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: themeColors.blueBgDark,
        onPrimary: themeColors.white, // Color for text and icons displayed on top of the primary color.
        info: themeColors.infoBlue, // Used to present information to the user that is neutral and not necessarily important.
        accent: themeColors.yellow,
        border: DefaultTheme.colors.text,
        card: DefaultTheme.colors.surface,
    },
};

/**
 * The maximum size (in density-independent pixels) for a screen to be considered "small".
 * Portrait mode on typical handheld smartphones falls within this range.
 */
export const SMALL_WIDTH = 600;

export default theme;

/**
 * react-native-paper useTheme() returns a theme of type MD3Theme by default, use this
 * function instead to access MD2Theme and custom theme properties for the mobile app
 */
export const useAppTheme = () => useTheme<CustomTheme>();
