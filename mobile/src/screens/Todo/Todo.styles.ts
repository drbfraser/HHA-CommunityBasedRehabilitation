import { StyleSheet } from "react-native";

const useStyles = () =>
    StyleSheet.create({
        container: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
        },
        userIdTextInput: {
            alignSelf: "stretch",
            marginHorizontal: 10,
        },
    });

export default useStyles;
