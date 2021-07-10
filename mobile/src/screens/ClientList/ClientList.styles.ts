import { StyleSheet } from "react-native";

const useStyles = () =>
    StyleSheet.create({
        container: {
            flex: 1,
            alignItems: "center",
            alignItems: "flex-start",
            paddingTop: 0,
        },
        item: {
            padding: 5,
            fontSize: 14,
            height: 44,
        },
        list: {
            padding: 10,
            fontSize: 18,
            height: 44,
        },
        select: {
            height: 50,
            width: 200,
            left:10,
        },
        search: {
            height: 50,
            width: 100,
            left: 15,
        },
        row: {
            flex: 1,
            flexDirection: "row"
        },
    });


export default useStyles;
