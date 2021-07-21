import { StyleSheet, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext, IAuthContext } from "../../context/AuthContext/AuthContext";
import { Endpoint } from "@cbr/common/index";
import { ActivityIndicator, Appbar, Button, Snackbar, Text } from "react-native-paper";
import { apiFetch, APIFetchFailError, IUser } from "@cbr/common";
import { StackScreenProps } from "@react-navigation/stack";
import { StackParamList } from "../../util/stackScreens";
import { StackScreenName } from "../../util/StackScreenName";
import UserProfileContents from "../../components/UserProfileContents/UserProfileContents";

const loadUser = (
    userId: number,
    setUser: React.Dispatch<React.SetStateAction<IUser | undefined>>,
    setErrorMessage: React.Dispatch<React.SetStateAction<string | undefined>>
) => {
    setErrorMessage(undefined);
    apiFetch(Endpoint.USER, `${userId}`)
        .then((resp) => resp.json())
        .then((userJson) => setUser(userJson))
        .catch((e) => {
            const msg =
                e instanceof APIFetchFailError && e.status == 404 ? "User doesn't exist" : `${e}`;
            setErrorMessage(msg);
        });
};

/**
 * A component for an Admin's view of a user's profile.
 */
const AdminView = ({
    navigation,
    route,
}: StackScreenProps<StackParamList, StackScreenName.ADMIN_VIEW>) => {
    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            header: (stackHeaderProps) => (
                <Appbar.Header statusBarHeight={0}>
                    <Appbar.BackAction onPress={() => stackHeaderProps.navigation.goBack()} />
                    <Appbar.Content title="View user" />
                </Appbar.Header>
            ),
        });
    }, []);

    const authContext = useContext<IAuthContext>(AuthContext);
    useEffect(() => {
        authContext.requireLoggedIn(true);
    }, []);

    const [isUserEditedSnackbarVisible, setUserEditedSnackbarVisible] = useState(false);

    const [user, setUser] = useState<IUser>();
    const [errorMessage, setErrorMessage] = useState<string>();
    useEffect(() => {
        if (route.params.newEditedUser) {
            setUserEditedSnackbarVisible(true);
            setUser(route.params.newEditedUser);
        } else {
            loadUser(route.params.userID, setUser, setErrorMessage);
        }
    }, [route.params.newEditedUser]);

    return !user || errorMessage ? (
        <View style={styles.loadingContainer}>
            {errorMessage ? (
                <>
                    <Text style={styles.loadingErrorText}>
                        Unable to load user with ID {route.params.userID}:
                    </Text>
                    <Text style={styles.loadingErrorText}>{errorMessage}</Text>
                    <Button
                        style={styles.retryButton}
                        onPress={() => loadUser(route.params.userID, setUser, setErrorMessage)}
                    >
                        Retry
                    </Button>
                </>
            ) : (
                <ActivityIndicator animating size={75} />
            )}
        </View>
    ) : (
        <>
            <UserProfileContents user={user} isSelf={false} />
            <Snackbar
                visible={isUserEditedSnackbarVisible}
                duration={4000}
                onDismiss={() => setUserEditedSnackbarVisible(false)}
            >
                User updated successfully.
            </Snackbar>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        marginHorizontal: 30,
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
    },
    loadingErrorText: {
        textAlign: "center",
        fontSize: 16,
    },
    profileInfoContainer: { flex: 1 },
    userFirstLastNameTitle: {
        marginVertical: 15,
        fontSize: 24,
        fontWeight: "bold",
    },
    profileInfoHeader: { fontWeight: "bold", fontSize: 18, marginBottom: 5 },
    profileInfoText: { fontSize: 18, marginBottom: 5 },
    button: { marginVertical: 5 },
    retryButton: { marginVertical: 10 },
});

export default AdminView;
