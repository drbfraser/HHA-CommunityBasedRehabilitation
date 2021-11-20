import { StyleSheet } from "react-native";

const useStyles = () =>
    StyleSheet.create({
        scrollViewStyles: {
            marginHorizontal: 5,
        },
        container: {
            flex: 1,
        },
        groupContainer: {
            flex: 0.25,
            padding: 10,
            justifyContent: "space-around",
        },
        resetBtbContainer: {
            backgroundColor: "white",
        },
        resetBtnLabel: {
            color: "red",
        },
    });

export default useStyles;
