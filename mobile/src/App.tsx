import React, { useEffect, useMemo, useState } from "react";
import { Provider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import theme from "./util/theme.styles";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import globalStyle from "./app.styles";
import { stackScreenProps } from "./util/stackScreens";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import {
    apiFetch,
    doLogin,
    doLogout,
    Endpoint,
    getAuthToken,
    isLoggedIn,
    IUser,
} from "@cbr/common";
import { AuthContext as AuthContext, IAuthContext } from "./context/AuthContext/AuthContext";
import { enableScreens } from "react-native-screens";
import Loading from "./screens/Loading/Loading";
import Login from "./screens/Login/Login";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthState } from "./context/AuthContext/AuthState";
import { KEY_CURRENT_USER } from "./util/AsyncStorageKeys";
import { StackScreenName } from "./util/StackScreenName";

// Ensure we use FragmentActivity on Android
// https://reactnavigation.org/docs/react-native-screens
enableScreens();

const Stack = createStackNavigator();
const styles = globalStyle();
const Tab = createMaterialBottomTabNavigator();

/**
 * @return A Promise resolving to the current user details fetched from the server or rejected if
 * unable to fetch the current user details from the server or if unable to cache the current user.
 */
const fetchAndCacheUserFromServer = async (): Promise<IUser> => {
    const currentUserFromServer: IUser = await apiFetch(Endpoint.USER_CURRENT)
        .then((resp) => resp.json())
        .then((user) => user as IUser);
    await AsyncStorage.setItem(KEY_CURRENT_USER, JSON.stringify(currentUserFromServer));
    return currentUserFromServer;
};

const getCurrentUserFromCache = async (): Promise<IUser | undefined> => {
    return AsyncStorage.getItem(KEY_CURRENT_USER)
        .then((userJson) => {
            return userJson != null ? (JSON.parse(userJson) as IUser) : undefined;
        })
        .catch((err) => {
            return undefined;
        });
};

/**
 * @see IAuthContext#requireLoggedIn
 */
const updateAuthStateIfNeeded = async (
    currentAuthState: AuthState,
    setAuthState: React.Dispatch<React.SetStateAction<AuthState>>,
    tryUpdateUserInfoFromServer: boolean
): Promise<void> => {
    // TODO: Decide on what to do when the refresh token expires. The current behaviour is
    //  to show the login screen again and block them from entering the app, forcing them to
    //  login to get a fresh refresh token again.
    //
    //  They might not be able to login if they're offline and the user might have data that
    //  they created offline.
    //  * Should we prevent them from accessing that data and require them to login again,
    //    or is this a security risk? Note that by doing this, they won't be able to access
    //    the data until they have internet and they can finally login to the server.
    //  * Otherwise, should we only prompt for login when they need to actually make an API
    //    call?
    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
        const currentUser = await getCurrentUserFromCache();
        if (currentUser) {
            setAuthState({ state: "previouslyLoggedIn", currentUser: currentUser });
        } else {
            setAuthState({ state: "loggedOut" });
        }
        return;
    }

    if (!tryUpdateUserInfoFromServer && currentAuthState.state === "loggedIn") {
        // This implicitly refreshes the access and refresh tokens if needed.
        // Note: If we don't enter this branch, the fetchAndCacheUserFromServer will also handle
        // refreshing the auth tokens if needed.
        await getAuthToken().catch();
        return;
    }

    const currentUser: IUser | undefined = await fetchAndCacheUserFromServer().catch((err) => {
        // At this point, the user is logged in, so the device is probably offline.
        // Use the cached user details.
        return getCurrentUserFromCache();
    });
    if (currentUser) {
        setAuthState({ state: "loggedIn", currentUser: currentUser });
    } else {
        // Note that here, the auth tokens are valid. So, the only possibility for
        // currentUser to be undefined is if the network call fails and we failed to get the
        // cached user details via AsyncStorage.
        //
        // Failure is extremely unlikely; the user details should've been cached on login.
        // It could be that there's something wrong with the SQLite database that
        // AsyncStorage manages. However, the auth tokens are in the database too, so it's
        // more likely that the call before to check auth tokens would've failed if the
        // SQLite database has issues. For now, we log the user out.
        // TODO: Handle this better. Maybe the user details can be embedded in the JWT token
        //  instead of needing an extra API call.
        console.error("failed to get current user details from database despite being logged in");
        await doLogout();
        setAuthState({ state: "loggedOut" });
    }
};

// TODO: Have a nice transition when the user logins and and logs out.
export default function App() {
    const [authState, setAuthState] = useState<AuthState>({ state: "unknown" });

    useEffect(() => {
        updateAuthStateIfNeeded(authState, setAuthState, true);
    }, []);

    // design inspired by https://reactnavigation.org/docs/auth-flow/
    const authContext = useMemo<IAuthContext>(
        () => ({
            login: async (username: string, password: string): Promise<void> => {
                await doLogin(username, password);

                try {
                    const currentUserFromServer = await fetchAndCacheUserFromServer();
                    setAuthState({ state: "loggedIn", currentUser: currentUserFromServer });
                } catch (e) {
                    setAuthState({ state: "loggedOut" });
                    throw e;
                }
            },
            logout: async () => {
                await doLogout();
                setAuthState({ state: "loggedOut" });
            },
            requireLoggedIn(tryUpdateUserFromServer: boolean): Promise<void> {
                return updateAuthStateIfNeeded(authState, setAuthState, tryUpdateUserFromServer);
            },
            authState: authState,
        }),
        [authState]
    );

    return (
        <SafeAreaView style={styles.safeApp}>
            <Provider theme={theme}>
                <NavigationContainer theme={theme}>
                    <AuthContext.Provider value={authContext}>
                        <Stack.Navigator>
                            {authState.state === "loggedIn" ? (
                                Object.values(StackScreenName).map((name) => (
                                    <Stack.Screen
                                        key={name}
                                        name={name}
                                        component={stackScreenProps[name]}
                                    />
                                ))
                            ) : authState.state === "loggedOut" ||
                              authState.state === "previouslyLoggedIn" ? (
                                <Stack.Screen
                                    name="Login"
                                    component={Login}
                                    options={{ headerShown: false }}
                                />
                            ) : (
                                <Stack.Screen
                                    name="Loading"
                                    component={Loading}
                                    options={{ headerShown: false }}
                                />
                            )}
                        </Stack.Navigator>
                    </AuthContext.Provider>
                </NavigationContainer>
            </Provider>
        </SafeAreaView>
    );
}
