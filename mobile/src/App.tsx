import React, { useEffect, useMemo, useState } from "react";
import { Provider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { screensForUser } from "./util/screens";
import theme from "./theme.styles";
import { createNativeStackNavigator } from "react-native-screens/native-stack";
import { doLogin, doLogout, isLoggedIn, IUser } from "@cbr/common";
import { AuthContext as AuthContext, IAuthContext } from "./context/AuthContext";
import { enableScreens } from "react-native-screens";
import Loading from "./screens/Loading/Loading";
import Login from "./screens/Login/Login";
import { apiFetch, Endpoint } from "@cbr/common";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Ensure we use FragmentActivity on Android
// https://reactnavigation.org/docs/react-native-screens
enableScreens();

const CURRENT_USER_KEY = "current_user";

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();

export interface AuthState {
    loggedIn: boolean;
    currentUser: IUser | undefined;
}

/**
 * @return A Promise resolving to the current user details fetched from the server or rejected if
 * unable to fetch the user from the server or if unable to cache the current user.
 */
const fetchAndCacheCurrentUser = async (): Promise<IUser> => {
    const currentUserFromServer: IUser = await apiFetch(Endpoint.USER_CURRENT)
        .then((resp) => resp.json())
        .then((user) => user as IUser);
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUserFromServer));
    return currentUserFromServer;
};

// TODO: Have a nice transition when the user logins and and logs out.
export default function App() {
    const [authState, setAuthState] = useState<AuthState>();

    useEffect(() => {
        const checkLoginAndUpdateCurrentUserCache = async () => {
            const loggedIn = await isLoggedIn();
            if (!loggedIn) {
                setAuthState({ loggedIn: false, currentUser: undefined });
                return;
            }

            const currentUser: IUser | undefined = await fetchAndCacheCurrentUser().catch((err) => {
                // Fetch the cached user details; the device might be offline.
                console.log("failed to get current user from server; falling back to cache");
                return AsyncStorage.getItem(CURRENT_USER_KEY).then((userJson) => {
                    return userJson != null ? (JSON.parse(userJson) as IUser) : undefined;
                });
            });
            if (currentUser == undefined) {
                await doLogout();
                setAuthState({ loggedIn: false, currentUser: undefined });
            } else {
                setAuthState({ loggedIn: true, currentUser: currentUser });
            }
        };
        checkLoginAndUpdateCurrentUserCache();
    }, []);

    // design inspired by https://reactnavigation.org/docs/auth-flow/
    const authContext = useMemo<IAuthContext>(
        () => ({
            login: async (username: string, password: string): Promise<boolean> => {
                const loginSucceeded = await doLogin(username, password);
                if (!loginSucceeded) {
                    setAuthState({ loggedIn: false, currentUser: undefined });
                    return false;
                }

                try {
                    const currentUserFromServer = await fetchAndCacheCurrentUser();
                    setAuthState({ loggedIn: true, currentUser: currentUserFromServer });
                    return true;
                } catch (e) {
                    setAuthState({ loggedIn: false, currentUser: undefined });
                    return false;
                }
            },
            logout: async () => {
                await doLogout();
                await AsyncStorage.removeItem(CURRENT_USER_KEY);
                setAuthState({ loggedIn: false, currentUser: undefined });
            },
        }),
        []
    );

    return (
        <Provider theme={theme}>
            <NavigationContainer theme={theme}>
                <AuthContext.Provider value={authContext}>
                    {authState?.loggedIn === true ? (
                        <Tab.Navigator>
                            {screensForUser(authState?.currentUser).map((screen) => (
                                <Tab.Screen
                                    key={screen.name}
                                    name={screen.name}
                                    component={screen.Component}
                                    options={{ tabBarIcon: screen.iconName }}
                                />
                            ))}
                        </Tab.Navigator>
                    ) : (
                        <Stack.Navigator>
                            {authState?.loggedIn === false ? (
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
                    )}
                </AuthContext.Provider>
            </NavigationContainer>
        </Provider>
    );
}
