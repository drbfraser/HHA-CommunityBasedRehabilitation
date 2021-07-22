import { StyleSheet } from "react-native";

const useStyles = () => {
    return StyleSheet.create({
        container: {
            marginTop: 30,
            marginHorizontal: 30,
            flex: 1,
        },
        loadingContainer: {
            flexDirection: "column",
        },
        profileInfoContainer: {
            flex: 1,
        },
        userFirstLastNameTitle: {
            marginVertical: 15,
            fontSize: 24,
            fontWeight: "bold",
        },
        profileInfoHeader: { fontWeight: "bold", fontSize: 18, marginBottom: 5 },
        profileInfoText: { fontSize: 18, marginBottom: 5 },
        button: {
            marginVertical: 5,
        },
    });
};

export default useStyles;
