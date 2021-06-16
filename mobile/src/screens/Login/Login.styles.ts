import { StyleSheet } from "react-native";


const useStyles = (theme: ReactNativePaper.Theme) => StyleSheet.create(
    {
        container: { ...StyleSheet.absoluteFillObject },
        logo: {
            width: "100%"
        },
        formContainer: {
            flex: 1,
            maxWidth: 350,
            margin: 30,
            color: theme.colors.onPrimary,
        },
    },
);

export default useStyles;
