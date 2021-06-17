import { StyleSheet } from "react-native";

const useStyles = (theme: ReactNativePaper.Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.primary,
        },
        background: { ...StyleSheet.absoluteFillObject },
        logo: {
            width: "100%",
        },
        formContainer: {
            flex: 1,
            maxWidth: 400,
            margin: 30,
            color: theme.colors.onPrimary,
        },
        loginHeader: {
            fontSize: 40,
            paddingTop: 20,
            color: theme.colors.onPrimary,
        },
    });

export default useStyles;
