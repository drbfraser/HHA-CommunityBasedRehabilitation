import { StyleSheet } from "react-native";

const useStyles = () => {
    return StyleSheet.create({
        container: {
            marginTop: 30,
            marginHorizontal: 30,
            flex: 1,
        },
        errorAlertContainer: {
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
        changePasswordButton: {
            marginVertical: 10,
        },
        logoutButton: {
            marginVertical: 5,
        },
    });
};

export default useStyles;
