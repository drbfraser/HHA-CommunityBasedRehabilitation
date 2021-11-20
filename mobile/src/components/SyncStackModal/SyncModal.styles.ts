import { StyleSheet } from "react-native";

const useStyles = () =>
    StyleSheet.create({
        container: {
            backgroundColor: "black",
        },
        contentContainer: {
            flex: 0.6,
            flexDirection: "row",
            justifyContent: "space-around",
            padding: 10,
        },
        buttonContainer: {
            flex: 0.3,
            alignItems: "center",
        },
    });

export default useStyles;
