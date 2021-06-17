import { StyleSheet } from "react-native";

const useStyles = () =>
    StyleSheet.create({
        container: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
        },
        centerElement: { justifyContent: "center", alignItems: "center" },
        nextButton: {
            position: "absolute",
            right: 20,
            bottom: 25,
        },
    });

export default useStyles;
