import { StyleSheet } from "react-native";

const useStyles = () =>
    StyleSheet.create({
        modalStyle: {
            height: 470,
            marginHorizontal: 20,
            marginTop: 100,
            marginBottom: 100,
            display: "flex",
            backgroundColor: "white",
            borderRadius: 10,
            alignContent: "center",
            alignItems: "center",
        },
        displayText: {
            textAlign: "left",
            fontSize: 18,
            margin: 10,
        },
        selectedText: {
            fontSize: 18,
            margin: 10,
            fontWeight: "bold",
        },
        selectTitle: {
            fontSize: 20,
            textAlign: "center",
            margin: 10,
            fontWeight: "bold",
        },
        languageButton: {
            padding: 3,
            marginTop: 3,
            marginBottom: 15,
            marginLeft: 10,
            marginRight: 10,
            width: 250,
            borderRadius: 5,
        },
    });

export default useStyles;
