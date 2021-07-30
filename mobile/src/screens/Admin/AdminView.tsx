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

interface ILoadError {
    statusCode?: number;
    message: string;
}

const loadUser = (
    userId: number,
    setUser: React.Dispatch<React.SetStateAction<IUser | undefined>>,
    setError: React.Dispatch<React.SetStateAction<ILoadError | undefined>>
) => {
    setError(undefined);
    apiFetch(Endpoint.USER, `${userId}`)
        .then((resp) => resp.json())
        .then((userJson) => setUser(userJson))
        .catch((e) => {
            const msg =
                e instanceof APIFetchFailError && e.status == 404 ? "User doesn't exist" : `${e}`;
            setError({
                statusCode: e instanceof APIFetchFailError ? e.status : undefined,
                message: msg,
            });
        });
};

/**
 * A component for an Admin's view of a user's profile.
 */
const AdminView = ({
    navigation,
    route,
}: StackScreenProps<StackParamList, StackScreenName.ADMIN_VIEW>) => {
    const authContext = useContext<IAuthContext>(AuthContext);
    useEffect(() => {
        authContext.requireLoggedIn(true);
    }, []);

    const [isUserChangeSnackbarVisible, setUserChangeSnackbarVisible] = useState(false);

    const [user, setUser] = useState<IUser>();
    const [error, setErrorMessage] = useState<ILoadError>();
    useEffect(() => {
        if (route.params.userInfo) {
            setUserChangeSnackbarVisible(true);
            setUser(route.params.userInfo.user);
        } else {
            loadUser(route.params.userID, setUser, setErrorMessage);
        }
    }, [route.params.userInfo]);

    return !user || error ? (
        <View style={styles.loadingContainer}>
            {error ? (
                <>
                    <Text style={styles.loadingErrorText}>
                        Unable to load user with ID {route.params.userID}:
                    </Text>
                    <Text style={styles.loadingErrorText}>{error.message}</Text>
                    {error.statusCode !== 404 ? (
                        <Button
                            style={styles.retryButton}
                            onPress={() => loadUser(route.params.userID, setUser, setErrorMessage)}
                        >
                            Retry
                        </Button>
                    ) : null}
                </>
            ) : (
                <ActivityIndicator animating size={75} />
            )}
        </View>
    ) : (
        <>
            <UserProfileContents user={user} isSelf={false} />
            <Snackbar
                visible={isUserChangeSnackbarVisible}
                duration={4000}
                onDismiss={() => setUserChangeSnackbarVisible(false)}
            >
                {route.params.userInfo?.isNewUser ? "User created." : "User updated successfully."}
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
