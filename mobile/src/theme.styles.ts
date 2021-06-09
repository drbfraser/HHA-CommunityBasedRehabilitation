import { DefaultTheme } from "react-native-paper";
import { themeColors } from "common";
import { Theme } from "react-native-paper/lib/typescript/types";

const theme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: themeColors.blueBgDark,
    accent: themeColors.yellow,
  },
};

export default theme;
