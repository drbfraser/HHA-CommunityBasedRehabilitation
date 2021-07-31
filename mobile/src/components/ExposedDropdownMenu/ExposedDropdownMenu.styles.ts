import { StyleSheet } from "react-native";

const useStyles = (textInputWidth: number) =>
    StyleSheet.create({
        menuContentStyle: {
            width: textInputWidth,
            top: -3,
        },
        invisibleAnchor: {
            width: textInputWidth,
            height: 1,
            marginBottom: 0,
        },
    });

export default useStyles;
