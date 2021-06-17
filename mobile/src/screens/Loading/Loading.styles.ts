import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

const useStyles = () => {
    const theme = useTheme();
    return StyleSheet.create({
        container: {
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            backgroundColor: theme.colors.primary,
        },
    });
};

export default useStyles;
