import { StyleSheet, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext, IAuthContext } from "../../context/AuthContext/AuthContext";
import { ActivityIndicator, Button, Snackbar, Text } from "react-native-paper";
import { APIFetchFailError, IUser, useCurrentUser } from "@cbr/common";
import { StackScreenProps } from "@react-navigation/stack";
import { StackParamList } from "../../util/stackScreens";
import { StackScreenName } from "../../util/StackScreenName";
import UserProfileContents from "../../components/UserProfileContents/UserProfileContents";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import { resourceLimits } from "worker_threads";
import { useIsFocused } from "@react-navigation/core";
import { modelName } from "../../models/constant";
import { useTranslation } from "react-i18next";

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

    const [isUserChangeSnackbarVisible, setUserChangeSnackbarVisible] = useState(false);

    const [user, setUser] = useState<IUser>();
    const isFocused = useIsFocused();
    const [error, setErrorMessage] = useState<ILoadError>();
    const database = useDatabase();
    const currentUser = useCurrentUser();
    const { t } = useTranslation();

    const loadUser = async (
        userId: string,
        setUser: React.Dispatch<React.SetStateAction<any | undefined>>,
        setError: React.Dispatch<React.SetStateAction<ILoadError | undefined>>
    ) => {
        setError(undefined);
        try {
            const result: any = await database.get(modelName.users).find(userId);
            const iUser: IUser = {
                id: result.id,
                username: result.username,
                first_name: result.first_name,
                last_name: result.last_name,
                role: result.role,
                zone: result.zone,
                phone_number: result.phone_number,
                is_active: result.is_active,
            };
            setUser(iUser);
        } catch (e) {
            setError({
                statusCode: e instanceof APIFetchFailError ? e.status : undefined,
                message: t("general.noObject", { object: t("general.user") }),
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
                        {t("cantLoadUserWithID", { userID: route.params.userID })}:
                    </Text>
                    <Text style={styles.loadingErrorText}>{error.message}</Text>
                    {error.statusCode !== 404 ? (
                        <Button
                            style={styles.retryButton}
                            onPress={() => loadUser(route.params.userID, setUser, setErrorMessage)}
                        >
                            {t("general.retry")}
                        </Button>
                    ) : null}
                </>
            ) : (
                <ActivityIndicator animating size={75} />
            )}
        </View>
    ) : (
        <>
            <UserProfileContents
                user={user}
                isSelf={user.id == currentUser!.id ? true : false}
                database={database}
            />
            <Snackbar
                visible={isUserChangeSnackbarVisible}
                duration={4000}
                onDismiss={() => setUserChangeSnackbarVisible(false)}
            >
                {route.params.userInfo?.isNewUser
                    ? t("general.objectCreated", { object: t("general.user") })
                    : t("general.objectUpdated", { object: t("general.user") })}
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
