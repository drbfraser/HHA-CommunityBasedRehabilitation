import { StyleSheet } from "react-native";

const useStyles = () =>
    StyleSheet.create({
        container: {
            flex: 1,
            alignItems: "center",
        },
        survey: {
            position: "absolute",
            left: 65,
            flex: 1,
            paddingTop: 130,
        },
        title: {
            position: "absolute",
            top: 30,
            fontSize: 35,
            fontWeight: "bold",
        },
        backbutton: {
            position: "absolute",
            left: 15,
            top: 75,
        },
        greyText: {
            color: "grey",
            fontSize: 20,
        },
        plainText: {
            fontSize: 15,
        },
        input: {
            height: 40,
            width: 200,
            margin: 5,
            padding: 5,
            borderWidth: 1,
        },
    });

export default useStyles;
