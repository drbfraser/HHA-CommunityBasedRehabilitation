import { useAppTheme } from "@/src/util/theme.styles";
import { StyleSheet } from "react-native";

const useStyles = () => {
    const theme = useAppTheme();
    return StyleSheet.create({
        container: {
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            backgroundColor: theme.colors.primary,
        },
        logo: {
            width: "75%",
        },
    });
};

export default useStyles;
