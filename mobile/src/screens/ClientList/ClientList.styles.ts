import { StyleSheet } from "react-native";

const useStyles = () =>
    StyleSheet.create({
        container: {
            flex: 1,
            paddingTop: 0,
        },
        item: {
            padding: 3,
            fontSize: 14,
            height: 44,
        },
        select: {
            flex:1
        },
        search: {
            flex:2
        },
        row: {
            flexDirection: "row"
        },
    });


export default useStyles;
