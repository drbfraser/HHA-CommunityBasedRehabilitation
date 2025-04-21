import { StyleSheet, useWindowDimensions } from "react-native";
import { SMALL_WIDTH, useAppTheme } from "../../util/theme.styles";

const useStyles = () => {
    const theme = useAppTheme();
    const { width } = useWindowDimensions();
    return StyleSheet.create({
        container: {
            backgroundColor: theme.colors.primary,
        },
        alert: {
            marginVertical: 15,
        },
        contentContainer: {
            //flex: 1,
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
            flexDirection: "column",
            bottom: width <= SMALL_WIDTH ? undefined : 70,
            maxWidth: width <= SMALL_WIDTH ? undefined : "55%",
            margin: 30,
            marginRight: width <= SMALL_WIDTH ? undefined : 60,
            color: theme.colors.onPrimary,
        },
        loginHeader: {
            marginVertical: 10,
            fontSize: 40,
            justifyContent: "flex-end",
            color: theme.colors.onPrimary,
        },
        versionInfo: {
            margin: 10,
            fontSize: 20,
            color: theme.colors.onPrimary,
            textAlign: "right",
            // justifyContent: "flex-end",
        },
        loginAgain: {
            color: theme.colors.onPrimary,
            marginBottom: 10,
        },
        logoutButton: {
            marginVertical: 10,
        },
        settingsButtonContainer: {
            flex: 1,
            justifyContent: "flex-end",
            alignSelf: "stretch",
            alignItems: "flex-end",
        },
    });
};

export default useStyles;
