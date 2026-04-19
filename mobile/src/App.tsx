import React, { useEffect, useMemo, useRef, useState } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { enableScreens } from "react-native-screens";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { Provider as StoreProvider } from "react-redux";
import { io } from "socket.io-client/";
import DatabaseProvider from "@nozbe/watermelondb/react/DatabaseProvider";
import "expo-font";
import {
    APILoadError,
    commonConfiguration,
    doLogin,
    doLogout,
    getAuthToken,
    getCurrentUser,
    invalidateAllCachedAPI,
    isLoggedIn,
    getI18nInstance,
    themeColors,
} from "@cbr/common";
import theme from "./util/theme.styles";
import globalStyle from "./app.styles";
import { stackScreenOptions, stackScreenProps } from "./util/stackScreens";
import { AuthContext as AuthContext, IAuthContext } from "./context/AuthContext/AuthContext";
import Loading from "./screens/Loading/Loading";
import { AuthState } from "./context/AuthContext/AuthState";
import { CacheRefreshTask } from "./tasks/CacheRefreshTask";
import { StackScreenName, NoAuthScreenName } from "./util/StackScreenName";
import { database } from "./util/watermelonDatabase";
import { SyncDatabaseTask } from "./tasks/SyncDatabaseTask";
import { SyncContext } from "./context/SyncContext/SyncContext";
import { SyncSettings } from "./screens/Sync/PrefConstants";
import { AutoSyncDB } from "./util/syncHandler";
import { store } from "./redux/store";
import { I18nextProvider } from "react-i18next";
import { AppState, AppStateStatus, StatusBar } from "react-native";
import { PinContext, IPinContext } from "./context/PinContext/PinContext";
import { PinState } from "./context/PinContext/PinState";
import {
    hasPin as hasStoredPin,
    setPin as storePin,
    verifyPin as verifyStoredPin,
} from "./util/pinStorage";
import PinSetup from "./screens/PinSetup/PinSetup";
import PinEntry from "./screens/PinEntry/PinEntry";

// Ensure we use FragmentActivity on Android
// https://reactnavigation.org/docs/react-native-screens
enableScreens();

// todosd: type safe routes for React Navigation.  better place for this?
// todosd: add all routes, using debugger and @react-navigation/devtools
type RootStackParamList = {
    Home: undefined;
    Client: undefined;
    BaselineSurvey: undefined;
    Referrals: undefined;
    BugReport: undefined;
    AdminView: undefined;
    AdminEdit: undefined;
    AdminNew: undefined;
    NewReferral: undefined;
    NewVisit: undefined;
    Sync: undefined;
    AlertInbox: undefined;
    Login: undefined;
    SwitchServer: undefined;
    Loading: undefined; // todosd: verify, where is this used?
    PinSetup: undefined;
    PinEntry: undefined;
    ClientDetails: { clientID: string };
    SuccessStories: { clientID: string; clientName?: string };
    SuccessStoryView: { clientID: string; storyId: string; clientName?: string };
    SuccessStoryNew: { clientID: string; storyId?: string; clientName?: string };
};

// todosd: better place for this?
// Specify a global type for our root navigator, to avoid the need for manual
// annotations for `useNavigation` as per
// https://reactnavigation.org/docs/6.x/typescript/#specifying-default-types-for-usenavigation-link-ref-etc
declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}

const Stack = createStackNavigator<RootStackParamList>();
const styles = globalStyle();

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
    const [pinState, setPinState] = useState<PinState>({ state: "unknown" });
    // Tracks whether the current in-memory session began with a password login. Reset on every
    // fresh app launch so a killed-then-reopened app forces password re-auth per spec.
    const passwordSessionActiveRef = useRef<boolean>(false);
    const [syncAlert, setSyncAlert] = useState<boolean>(false);
    const [autoSync, setAutoSync] = useState<boolean>(true);
    const [cellularSync, setCellularSync] = useState<boolean>(false);
    const [screenRefresh, setScreenRefresh] = useState<boolean>(false);

    // Load the language from AsyncStorage
    // Source: https://medium.com/@lasithherath00/implementing-react-native-i18n-and-language-selection-with-asyncstorage-b24ae59e788e
    useEffect(() => {
        const loadLanguage = async () => {
            try {
                const storedLanguage = await AsyncStorage.getItem("language");
                if (storedLanguage) {
                    getI18nInstance().changeLanguage(storedLanguage);
                    console.log("Language loaded:", storedLanguage);
                }
            } catch (e) {
                console.error(e);
            }
        };

        loadLanguage();
    }, []);

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
            .finally(async () => {
                // Resolve the auth state. invalidateAllCachedAPI already tries to refetch the
                // current user information so pass false for tryUpdateUserInfoFromServer to avoid
                // an unnecessary refetch.
                const autoSyncPref = await AsyncStorage.getItem(SyncSettings.AutoSyncPref);
                if (autoSyncPref != null) {
                    setAutoSync(autoSyncPref === "true");
                }
                const cellularSyncPref = await AsyncStorage.getItem(SyncSettings.CellularPref);
                if (cellularSyncPref != null) {
                    setCellularSync(cellularSyncPref === "true");
                }
                return updateAuthStateIfNeeded(authState, setAuthState, false);
            });

        const socket = io(`${commonConfiguration.socketIOUrl}`, {
            transports: ["websocket"], // explicitly use websockets
            autoConnect: true,
            // jsonp: false, // avoid manipulation of DOM
        });

        socket.on("connect", () => {
            console.log(`[SocketIO] Mobile user connected. SocketID: ${socket.id}`);
        });

        socket.on("disconnect", () => {
            console.log(`[SocketIO] Mobile user disconnected.`);
        });
    }, []);

    useEffect(() => {
        if (autoSync) {
            SyncDatabaseTask.scheduleAutoSync(database, autoSync, cellularSync);
        }
    }, [autoSync]);

    useEffect(() => {
        if (authState.state === "loggedIn") {
            setScreenRefresh(true);
            if (autoSync) {
                AutoSyncDB(database, autoSync, cellularSync).then(() => {
                    SyncDatabaseTask.scheduleAutoSync(database, autoSync, cellularSync);
                });
            }
        }
    }, [authState]);

    // Resolve PIN state whenever the auth state changes. PIN state is meaningful only while
    // logged in; on logout we reset it so the next login re-evaluates from scratch.
    useEffect(() => {
        let cancelled = false;
        const resolvePinState = async () => {
            if (authState.state !== "loggedIn") {
                setPinState({ state: "unknown" });
                return;
            }
            const username = authState.currentUser.username;
            const exists = await hasStoredPin(username);
            if (cancelled) {
                return;
            }
            if (!exists) {
                setPinState({ state: "noPin" });
                return;
            }
            // A PIN exists. If this session started with a password login (fresh login), we
            // keep the app unlocked. Otherwise (refresh-token auto-resume after a kill), we
            // require password re-auth per spec.
            if (passwordSessionActiveRef.current) {
                setPinState({ state: "unlocked" });
            } else {
                passwordSessionActiveRef.current = false;
                setPinState({ state: "unknown" });
                await doLogout();
                setAuthState({ state: "previouslyLoggedIn", currentUser: authState.currentUser });
            }
        };
        resolvePinState().catch((e) => console.error(`PIN state resolve failed: ${e}`));
        return () => {
            cancelled = true;
        };
    }, [authState]);

    // Lock the app when it leaves the foreground. We only lock when the user is actually
    // unlocked; "noPin" users are mid-setup and shouldn't be bumped to the lock screen.
    useEffect(() => {
        const handleChange = (next: AppStateStatus) => {
            if (next === "active") {
                return;
            }
            setPinState((prev) => {
                if (prev.state === "unlocked") {
                    return { state: "locked", failedAttempts: 0 };
                }
                return prev;
            });
        };
        const sub = AppState.addEventListener("change", handleChange);
        return () => sub.remove();
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

                // Mark this session as password-authenticated so the PIN gate knows it can go
                // straight to unlocked / setup once auth state resolves.
                passwordSessionActiveRef.current = true;
                return await updateAuthStateIfNeeded(authState, setAuthState, false);
            },
            logout: async () => {
                // BackgroundFetch is unregistered & Sync is unscheduled in the logout callback
                await doLogout();
                passwordSessionActiveRef.current = false;
                setPinState({ state: "unknown" });
                setAuthState({ state: "loggedOut" });
            },
            requireLoggedIn(tryUpdateUserFromServer: boolean): Promise<void> {
                return updateAuthStateIfNeeded(authState, setAuthState, tryUpdateUserFromServer);
            },
            authState: authState,
        }),
        [authState]
    );

    const pinContext = useMemo<IPinContext>(
        () => ({
            pinState,
            setPin: async (pin: string) => {
                if (authState.state !== "loggedIn") {
                    throw new Error("Cannot set PIN when not logged in");
                }
                await storePin(authState.currentUser.username, pin);
                setPinState({ state: "unlocked" });
            },
            verifyPin: async (pin: string) => {
                if (authState.state !== "loggedIn") {
                    return false;
                }
                const ok = await verifyStoredPin(authState.currentUser.username, pin);
                if (ok) {
                    setPinState({ state: "unlocked" });
                    return true;
                }
                setPinState((prev) => {
                    if (prev.state !== "locked") {
                        return prev;
                    }
                    return { state: "locked", failedAttempts: prev.failedAttempts + 1 };
                });
                return false;
            },
            lock: () => {
                setPinState((prev) =>
                    prev.state === "unlocked" ? { state: "locked", failedAttempts: 0 } : prev
                );
            },
            fallbackToPassword: async () => {
                const previousUser =
                    authState.state === "loggedIn" ? authState.currentUser : undefined;
                await doLogout();
                passwordSessionActiveRef.current = false;
                setPinState({ state: "unknown" });
                setAuthState(
                    previousUser
                        ? { state: "previouslyLoggedIn", currentUser: previousUser }
                        : { state: "loggedOut" }
                );
            },
        }),
        [authState, pinState]
    );

    return (
        <SafeAreaView style={styles.safeApp}>
            <I18nextProvider i18n={getI18nInstance()}>
                <StoreProvider store={store}>
                    <PaperProvider theme={theme}>
                        <NavigationContainer theme={theme}>
                            <StatusBar
                                backgroundColor={themeColors.statusBarBgGray}
                                barStyle="light-content"
                            />

                            <AuthContext.Provider value={authContext}>
                                <PinContext.Provider value={pinContext}>
                                    <SyncContext.Provider
                                        value={{
                                            unSyncedChanges: syncAlert,
                                            setUnSyncedChanges: setSyncAlert,
                                            autoSync: autoSync,
                                            setAutoSync: setAutoSync,
                                            cellularSync: cellularSync,
                                            setCellularSync: setCellularSync,
                                            screenRefresh: screenRefresh,
                                            setScreenRefresh: setScreenRefresh,
                                        }}
                                    >
                                        <DatabaseProvider database={database}>
                                            <Stack.Navigator>
                                                {authState.state === "loggedIn" &&
                                                pinState.state === "unlocked" ? (
                                                    Object.values(StackScreenName).map((name) => (
                                                        <Stack.Screen
                                                            key={name}
                                                            name={name}
                                                            component={stackScreenProps[name]}
                                                            // @ts-ignore
                                                            options={stackScreenOptions[name]}
                                                        />
                                                    ))
                                                ) : authState.state === "loggedIn" &&
                                                  pinState.state === "noPin" ? (
                                                    <Stack.Screen
                                                        name="PinSetup"
                                                        component={PinSetup}
                                                        options={{ headerShown: false }}
                                                    />
                                                ) : authState.state === "loggedIn" &&
                                                  pinState.state === "locked" ? (
                                                    <Stack.Screen
                                                        name="PinEntry"
                                                        component={PinEntry}
                                                        options={{ headerShown: false }}
                                                    />
                                                ) : authState.state === "loggedOut" ||
                                                  authState.state === "previouslyLoggedIn" ? (
                                                    Object.values(NoAuthScreenName).map((name) => (
                                                        <Stack.Screen
                                                            key={name}
                                                            name={name}
                                                            component={stackScreenProps[name]}
                                                            // @ts-ignore
                                                            options={stackScreenOptions[name]}
                                                        />
                                                    ))
                                                ) : (
                                                    <Stack.Screen
                                                        name="Loading"
                                                        component={Loading}
                                                        options={{ headerShown: false }}
                                                    />
                                                )}
                                            </Stack.Navigator>
                                        </DatabaseProvider>
                                    </SyncContext.Provider>
                                </PinContext.Provider>
                            </AuthContext.Provider>
                        </NavigationContainer>
                    </PaperProvider>
                </StoreProvider>
            </I18nextProvider>
        </SafeAreaView>
    );
}
