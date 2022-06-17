import { StyleSheet } from "react-native";

const useStyles = () =>
    StyleSheet.create({
        container: {
            backgroundColor: "black",
        },
        contentContainer: {
            marginBottom: 10,
            flexDirection: "row",
            justifyContent: "space-around",
            padding: 10,
        },
    });

export default useStyles;
