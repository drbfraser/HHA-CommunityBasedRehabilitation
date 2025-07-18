import { themeColors } from "@cbr/common";
import { StyleSheet } from "react-native";

const useStyles = () =>
    StyleSheet.create({
        modal: {
            backgroundColor: themeColors.white,
        },
        modalContent: {
            paddingBottom: 0,
        },
        button: {
            flex: 1,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 10,
        },
        buttonText: {
            fontSize: 16,
            paddingVertical: 15,
        },
        editIcon: {
            alignSelf: "center",
            marginRight: 16,
        },
        closeButtonText: {
            fontSize: 16,
        },
    });

export default useStyles;
