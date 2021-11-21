import { StyleSheet } from "react-native";

const useStyles = () =>
    StyleSheet.create({
        scrollViewStyles: {
            marginHorizontal: 5,
        },
        container: {
            flex: 1,
        },
        groupContainer: {
            flex: 0.4,
            padding: 10,
            justifyContent: "space-around",
        },
        resetBtbContainer: {
            backgroundColor: "white",
        },
        resetBtnLabel: {
            color: "red",
        },
        cardSectionTitle: {
            textAlign: "center",
            marginTop: 14,
            marginBottom: 14,
            fontSize: 28,
        },
        CardStyle: {
            display: "flex",
            justifyContent: "space-between",
            marginTop: 20,
            marginBottom: 20,
            padding: 20,
            borderRadius: 20,
        },
        row: {
            flexDirection: "row",
            justifyContent: "space-between",
        },
        stats: {
            color: "grey",
        },
    });

export default useStyles;
