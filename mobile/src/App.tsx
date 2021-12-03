import React, { useEffect, useMemo, useState } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import theme from "./util/theme.styles";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import globalStyle from "./app.styles";
import { stackScreenOptions, stackScreenProps } from "./util/stackScreens";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import {
    APILoadError,
    doLogin,
    doLogout,
    getAuthToken,
    getCurrentUser,
    invalidateAllCachedAPI,
    isLoggedIn,
} from "@cbr/common";
import { AuthContext as AuthContext, IAuthContext } from "./context/AuthContext/AuthContext";
import { enableScreens } from "react-native-screens";
import Loading from "./screens/Loading/Loading";
import Login from "./screens/Login/Login";
import { AuthState } from "./context/AuthContext/AuthState";
import { CacheRefreshTask } from "./tasks/CacheRefreshTask";
import { SyncDatabaseTask } from "./tasks/SyncDatabaseTask";
import { StackScreenName } from "./util/StackScreenName";
import DatabaseProvider from "@nozbe/watermelondb/DatabaseProvider";
import { database } from "./util/watermelonDatabase";
import { DEV_API_URL } from "react-native-dotenv";
import { io } from "socket.io-client/dist/socket.io";

import { Provider as StoreProvider } from "react-redux";
import { store } from "./redux/store";

// Ensure we use FragmentActivity on Android
// https://reactnavigation.org/docs/react-native-screens
enableScreens();

const Stack = createStackNavigator();
const styles = globalStyle();
const Tab = createMaterialBottomTabNavigator();

const appEnv = process.env.NODE_ENV;

let hostname: string;
if (appEnv === "prod") {
    hostname = "https://cbrp.cradleplatform.com";
} else if (appEnv === "staging") {
    hostname = "https://cbrs.cradleplatform.com";
} else {
    hostname = DEV_API_URL.replace(/(api)\/$/, ""); // remove '/api/'
}

/**
 * @see IAuthContext#requireLoggedIn
 * @return A Promise that resolves if the login was successful and rejects otherwise.
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
    const shouldTryRefreshingUserInfo = tryUpdateUserInfoFromServer && loggedIn;
    const currentUser = await getCurrentUser(shouldTryRefreshingUserInfo);
    // This "isLoggedIn" function is just a refresh token expiry check, so here we're just checking
    // if the refresh token is expired (hence they could still have user information).
    if (!loggedIn) {
        if (currentUser !== APILoadError) {
            setAuthState({ state: "previouslyLoggedIn", currentUser: currentUser });
        } else {
            setAuthState({ state: "loggedOut" });
        }
        return;
    }

    if (!shouldTryRefreshingUserInfo && currentAuthState.state === "loggedIn") {
        // We're already logged in and we didn't try to update user info. Don't bother updating
        // the auth state.
        //
        // Since we didn't try to fetch user info, we  implicitly refresh the access and refresh
        // tokens here if needed.
        await getAuthToken().catch();
        return;
    }

    if (currentUser !== APILoadError) {
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

export default function App() {
    const [authState, setAuthState] = useState<AuthState>({ state: "unknown" });

    useEffect(() => {
        // Refresh disabilities, zones, current user information
        isLoggedIn()
            .then((loggedIn) => {
                if (loggedIn) {
                    console.log("App init: re-fetching cached API from the server");
                    return invalidateAllCachedAPI("refresh");
                }
            })
            .catch((e) => console.error(`App init: error during initialization: ${e}`))
            .finally(() => {
                // Resolve the auth state. invalidateAllCachedAPI already tries to refetch the
                // current user information so pass false for tryUpdateUserInfoFromServer to avoid
                // an unnecessary refetch.
                return updateAuthStateIfNeeded(authState, setAuthState, false);
            });

        const socket = io(`${hostname}`, {
            transports: ["websocket"], // explicitly use websockets
            autoConnect: true,
            jsonp: false, // avoid manipulation of DOM
        });

        socket.on("connect", () => {
            console.log(
                `[SocketIO] Mobile user connected on ${socket.io.engine.hostname}:${socket.io.engine.port}. SocketID: ${socket.id}`
            );
        });

        socket.on("disconnect", () => {
            console.log(`[SocketIO] Mobile user disconnected.`);
        });
    }, []);

    // design inspired by https://reactnavigation.org/docs/auth-flow/
    const authContext = useMemo<IAuthContext>(
        () => ({
            login: async (username: string, password: string): Promise<void> => {
                // This throws an error if login fails.
                await doLogin(username, password);

                await Promise.all([
                    CacheRefreshTask.registerBackgroundFetch(),
                    // This will fetch all cached API data so that they're pre-loaded.
                    invalidateAllCachedAPI("login"),
                ]);

                return await updateAuthStateIfNeeded(authState, setAuthState, false);
            },
            logout: async () => {
                // Stop performing scheduled sync on log out
                SyncDatabaseTask.deactivateAutoSync();
                // BackgroundFetch is unregistered in the logout callback
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

    if (authState.state === "loggedIn") {
        SyncDatabaseTask.autoSyncDatabase(database);
    }

    return (
        <SafeAreaView style={styles.safeApp}>
            <StoreProvider store={store}>
                <PaperProvider theme={theme}>
                    <NavigationContainer theme={theme}>
                        <AuthContext.Provider value={authContext}>
                            <DatabaseProvider database={database}>
                                <Stack.Navigator>
                                    {authState.state === "loggedIn" ? (
                                        Object.values(StackScreenName).map((name) => (
                                            <Stack.Screen
                                                key={name}
                                                name={name}
                                                component={stackScreenProps[name]}
                                                // @ts-ignore
                                                options={stackScreenOptions[name]}
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
                            </DatabaseProvider>
                        </AuthContext.Provider>
                    </NavigationContainer>
                </PaperProvider>
            </StoreProvider>
        </SafeAreaView>
    );
}
