import { themeColors } from "@cbr/common";
import { StyleSheet } from "react-native";

const useStyles = () =>
    StyleSheet.create({
        picker: { height: 55, width: "100%", flexGrow: 1 },
        pickerBoard: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "stretch",
            borderWidth: 1.2,
            borderRadius: 4,
            marginTop: 10,
            borderColor: themeColors.borderGray,
        },
    });

export default useStyles;
