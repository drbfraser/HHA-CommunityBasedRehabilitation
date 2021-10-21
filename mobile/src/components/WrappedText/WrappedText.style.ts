import { StyleSheet } from "react-native";
const useStyles = () =>
    StyleSheet.create({
        wrappedView: {
            flexDirection: "row",
            flex: 1.5,
            alignItems: "center",
            padding: 5,
        },
        text: {
            flexShrink: 1,
        },
    });

export default useStyles;
