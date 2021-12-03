import { StyleSheet } from "react-native";
import { themeColors } from "@cbr/common";

const useStyles = () =>
    StyleSheet.create({
        closeBtn: {
            justifyContent: "flex-end",
            position: "absolute",
            right: 15,
            bottom: 10,
        },
        conflictDialog: {
            maxHeight: 500,
            top: -45,
        },
        conflictDialogTitle: {
            alignSelf: "center",
        },
        conflictDialogContent: {
            alignSelf: "center",
            maxHeight: 400,
            width: "100%",
            bottom: 10,
        },
        conflictMessage: {
            textAlign: "center",
            marginBottom: 25,
        },
        conflictName: {
            alignSelf: "flex-start",
            color: themeColors.blueBgDark,
            fontSize: 14,
            fontWeight: "bold",
            padding: 5,
            paddingLeft: 8,
            marginTop: 15,
            marginBottom: 10,
            borderWidth: 2,
            borderRadius: 10,
            borderColor: themeColors.blueBgDark,
        },
        conflictContentBold: {
            color: "grey",
            fontWeight: "bold",
        },
        conflictContent: {
            color: "grey",
        },
        conflictPicture: {
            backgroundColor: themeColors.white,
            width: 150,
            height: 150,
            marginTop: 10,
            marginBottom: 10,
            borderRadius: 20,
            overflow: "hidden",
        },
    });

export default useStyles;
