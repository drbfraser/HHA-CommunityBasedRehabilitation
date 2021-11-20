import { StyleSheet } from "react-native";

const useStyles = () =>
    StyleSheet.create({
        container: {
            backgroundColor: "black",
        },
        contentContainer: {
            flex: 1,
            marginBottom: 10,
            padding: 10,
        },
        buttonContainer: {
            padding: 2,
        },
    });

export default useStyles;
