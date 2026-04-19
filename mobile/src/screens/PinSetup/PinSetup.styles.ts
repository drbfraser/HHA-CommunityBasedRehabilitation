import { StyleSheet } from "react-native";
import { useAppTheme } from "../../util/theme.styles";

const useStyles = () => {
    const theme = useAppTheme();
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.primary,
            padding: 30,
        },
        title: {
            color: theme.colors.onPrimary,
            fontSize: 28,
            textAlign: "center",
            marginBottom: 10,
        },
        subtitle: {
            color: theme.colors.onPrimary,
            fontSize: 16,
            textAlign: "center",
            marginBottom: 30,
        },
        input: {
            marginVertical: 10,
            backgroundColor: theme.colors.onPrimary,
        },
        alert: {
            marginVertical: 15,
        },
        button: {
            marginTop: 20,
        },
        secondaryButton: {
            marginTop: 10,
        },
    });
};

export default useStyles;
