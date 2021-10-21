import { StyleSheet } from "react-native";

const useStyles = (textInputWidth: number) =>
    StyleSheet.create({
        menuContentStyle: {
            width: textInputWidth,
            top: -3,
        },
    });

export default useStyles;
