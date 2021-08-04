import { themeColors } from "@cbr/common";
import { StyleSheet } from "react-native";

const useStyles = () =>
    StyleSheet.create({
        container: {
            margin: 20,
        },
        imageContainer: {
            paddingHorizontal: 50,
        },
        image: {
            resizeMode: "contain",
            width: "100%",
            height: "auto",
            aspectRatio: 1,
        },
        field: {
            marginTop: 5,
        },
        divider: {
            borderColor: themeColors.borderGray,
            borderBottomWidth: 1,
            margin: 5,
            marginTop: 10,
        },
        submitButtonContainer: {
            marginTop: 10,
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignContent: "space-between",
        },
        submitButtonWrapper: {
            flexShrink: 1,
            marginRight: 15,
        },
        submitButtonLabel: {
            paddingVertical: 4,
            paddingHorizontal: 10,
        },
    });

export default useStyles;
