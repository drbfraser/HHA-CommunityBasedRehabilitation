import { StyleSheet, useWindowDimensions } from "react-native";
import { useTheme } from "react-native-paper";
import { SMALL_WIDTH } from "../../theme.styles";

const useStyles = () => {
    const theme = useTheme();
    const { width } = useWindowDimensions();
    return StyleSheet.create({
        container: {
            backgroundColor: theme.colors.primary,
        },
        alert: {
            marginVertical: 10,
        },
        contentContainer: {
            flexDirection: "row",
            alignContent: "flex-start",
            justifyContent: width <= SMALL_WIDTH ? "center" : "flex-end",
        },
        background: { ...StyleSheet.absoluteFillObject },
        logo: {
            top: 50,
            width: "100%",
        },
        formContainer: {
            flex: 1,
            bottom: width <= SMALL_WIDTH ? undefined : 70,
            maxWidth: width <= SMALL_WIDTH ? undefined : "55%",
            margin: 30,
            marginRight: width <= SMALL_WIDTH ? undefined : 60,
            color: theme.colors.onPrimary,
        },
        loginHeader: {
            marginVertical: 10,
            fontSize: 40,
            color: theme.colors.onPrimary,
        },
        loginAgain: {
            color: theme.colors.onPrimary,
            marginBottom: 10,
        },
        textInput: {
            marginVertical: 10,
        },
        button: {
            marginVertical: 10,
        },
    });
};

export default useStyles;
