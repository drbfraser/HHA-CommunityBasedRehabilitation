import { StyleSheet } from "react-native";

const useStyles = () =>
    StyleSheet.create({
        checkBoxText: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 10,
            paddingRight: 50,
        },
    });

export default useStyles;
