import { StyleSheet, useWindowDimensions } from "react-native";
import { useTheme } from "react-native-paper";

const useStyles = () => {
    const theme = useTheme();
    const { width } = useWindowDimensions();
    return StyleSheet.create({
        container: {
            backgroundColor: theme.colors.primary,
        },
        contentContainer: {
            flexDirection: "row",
            alignContent: "flex-start",
            justifyContent: width <= 600 ? "center" : "flex-end",
        },
        background: { ...StyleSheet.absoluteFillObject },
        logo: {
            top: 50,
            width: "100%",
        },
        formContainer: {
            flex: 1,
            bottom: width <= 600 ? undefined : 70,
            maxWidth: width <= 600 ? undefined : "55%",
            margin: 30,
            marginRight: width <= 600 ? undefined : 60,
            color: theme.colors.onPrimary,
        },
        loginHeader: {
            fontSize: 40,
            color: theme.colors.onPrimary,
        },
        loginAgain: {
            color: theme.colors.onPrimary,
        },
        button: {
            marginBottom: 10,
        },
    });
};

export default useStyles;
