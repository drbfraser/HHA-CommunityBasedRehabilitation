import { StyleSheet } from "react-native";
const useStyles = () =>
    StyleSheet.create({
        wrappedView: {
            flexDirection: "row",
            flex: 1.5,
            alignItems: "center",
            padding: 5,
        },
        primaryText: {
            flexShrink: 1,
        },
        secondaryText: {
            flexShrink: 1,
            color: "grey",
        },
    });

export default useStyles;
