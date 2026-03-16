import { StyleSheet } from "react-native";
import { themeColors } from "@cbr/common";
import theme from "@/src/util/theme.styles";

const useStyles = () =>
    StyleSheet.create({
        container: {
            marginTop: 3,
            marginBottom: 3,
            width: 320,
            height: 88,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
        },
        activityTypeView: {
            flexDirection: "column",
            alignItems: "center",
        },
        logoButton: {
            width: 44,
            height: 44,
            justifyContent: "center",
            borderRadius: 100,
            borderWidth: 1,
            borderColor: themeColors.borderGray,
        },
        logoButtonDark: {
            width: 44,
            height: 44,
            justifyContent: "center",
            borderRadius: 100,
            backgroundColor: "#273364",
        },
        arrowButton: {
            width: 50,
            height: 50,
            justifyContent: "center",
        },
        verticleLine: {
            height: 18,
            width: 1,
            backgroundColor: "#909090",
        },
        subItem: {
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            marginTop: 2,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: 140,
        },
        subItemRow: {
            flexDirection: "row",
        },
        subItemText: {
            marginLeft: 10,
            marginEnd: 10,
            paddingLeft: 10,
            color: themeColors.textGray,
            textAlign: "left",
        },
        subItemTextDark: {
            marginLeft: 40,
            fontWeight: "bold",
        },
        dateText: {
            width: "25%",
            color: themeColors.textGray,
        },
        textGray: {
            color: themeColors.textGray,
            textAlign: "center",
        },
        dividerStyle: {
            borderBottomColor: "black",
            borderBottomWidth: 0.5,
        },
        popupStyle: {
            height: "auto",
            marginHorizontal: 20,
            marginTop: 140,
            marginBottom: 40,
            display: "flex",
            backgroundColor: "white",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: 10,
        },
        rowContainer: {
            position: "relative",
            width: "100%",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
        },

        imageContainer: {
            width: 20,
            alignItems: "flex-end",
            position: "absolute",
            top: 6,
            right: 0,
            paddingTop: 2,
        },
        contentColumn: {
            flex: 1,
            marginLeft: 10,
        },
    });

export default useStyles;
