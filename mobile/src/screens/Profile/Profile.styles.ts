import { StyleSheet } from "react-native";

const useStyles = () => {
    return StyleSheet.create({
        container: {
            margin: 30,
            flex: 1,
        },
        errorAlertContainer: {
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center",
        },
        profileInfoContainer: {
            flex: 1,
        },
        userFirstLastNameTitle: {
            marginVertical: 15,
            fontSize: 24,
            fontWeight: "bold",
        },
        profileInfoHeader: { fontWeight: "bold" },
        logoutButton: {
            position: "absolute",
            right: 0,
            bottom: 0,
        },
    });
};

export default useStyles;
