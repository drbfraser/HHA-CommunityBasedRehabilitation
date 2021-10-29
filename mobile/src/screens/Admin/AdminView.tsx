import { StyleSheet, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext, IAuthContext } from "../../context/AuthContext/AuthContext";
import { ActivityIndicator, Button, Snackbar, Text } from "react-native-paper";
import { APIFetchFailError, IUser } from "@cbr/common";
import { StackScreenProps } from "@react-navigation/stack";
import { StackParamList } from "../../util/stackScreens";
import { StackScreenName } from "../../util/StackScreenName";
import UserProfileContents from "../../components/UserProfileContents/UserProfileContents";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import { resourceLimits } from "worker_threads";
import { useIsFocused } from "@react-navigation/core";

interface ILoadError {
    statusCode?: number;
    message: string;
}

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

    const [user, setUser] = useState<any>();
    const isFocused = useIsFocused();
    const [error, setErrorMessage] = useState<ILoadError>();
    const database = useDatabase();

    const loadUser = async (
        userId: string,
        setUser: React.Dispatch<React.SetStateAction<any | undefined>>,
        setError: React.Dispatch<React.SetStateAction<ILoadError | undefined>>
    ) => {
        setError(undefined);
        try {
            const result: any = await database.get("users").find(userId);
            const iUser: IUser = {
                id: result.id,
                username: result.username,
                first_name: result.first_name,
                last_name: result.last_name,
                role: result.role,
                zone: result.zone,
                phone_number: result.phone_number,
                is_active: false,
            };
            setUser(iUser);
        } catch (e) {
            const msg = "User doesn't exist";
            setError({
                statusCode: e instanceof APIFetchFailError ? e.status : undefined,
                message: msg,
            });
        }
    };

    useEffect(() => {
        if (isFocused) {
            if (route.params.userInfo) {
                setUserChangeSnackbarVisible(true);
                setUser(route.params.userInfo.user);
            } else {
                loadUser(route.params.userID, setUser, setErrorMessage);
            }
        }
    }, [isFocused]);

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
            <UserProfileContents user={user} isSelf={false} database={database} />
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
