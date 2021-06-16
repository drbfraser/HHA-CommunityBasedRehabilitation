import { DefaultTheme } from "react-native-paper";
import { themeColors } from "@cbr/common";
import { Theme as PaperTheme } from "react-native-paper/lib/typescript/types";
import { Theme as NavigationTheme } from "@react-navigation/native";

const theme: PaperTheme & NavigationTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: themeColors.blueBgDark,
        accent: themeColors.yellow,
        border: DefaultTheme.colors.text,
        card: DefaultTheme.colors.surface,
    },
};

export default theme;
