import { StyleSheet } from "react-native";

const useStyles = () =>
    StyleSheet.create({
        container: {
            marginTop: 3,
            marginBottom: 3,
            width: 320,
            height: 88,
            flexDirection: "row",
            justifyContent: "space-between",
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
        },
        verticleLine: {
            height: 18,
            width: 1,
            backgroundColor: "#909090",
        },
        subItem: {
            borderColor: "#6890AC",
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            marginTop: 2,
            borderWidth: 5,
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
        },
    });

export default useStyles;
