import React, { useEffect, useMemo, useState } from "react";
import { Provider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { screensForUser } from "./util/screens";
import theme from "./theme.styles";
import { createNativeStackNavigator } from "react-native-screens/native-stack";
import { doLogin, doLogout, isLoggedIn } from "@cbr/common";
import { AuthContext as AuthContext, IAuthContext } from "./context/AuthContext";
import { enableScreens } from "react-native-screens";
import Loading from "./screens/Loading/Loading";
import Login from "./screens/Login/Login";

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Use FragmentActivity on Android
// https://reactnavigation.org/docs/react-native-screens
enableScreens();

// TODO: Have a nice transition when the user logins and and logs out.
export default function App() {
    const [loggedIn, setLoggedIn] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        const checkLogin = async () => {
            const loggedInState = await isLoggedIn();
            setLoggedIn(loggedInState);
        };
        checkLogin();
    }, []);

    // design inspired by https://reactnavigation.org/docs/auth-flow/
    const authContext = useMemo<IAuthContext>(
        () => ({
            login: async (username: string, password: string) => {
                const loginSucceeded = await doLogin(username, password);
                setLoggedIn(loginSucceeded);
                return loginSucceeded;
            },
            logout: async () => {
                doLogout();
                setLoggedIn(false);
            },
        }),
        []
    );

    return (
        <Provider theme={theme}>
            <NavigationContainer theme={theme}>
                <AuthContext.Provider value={authContext}>
                    {loggedIn === true ? (
                        <Tab.Navigator>
                            {screensForUser(undefined).map((screen) => (
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
                            {loggedIn === false ? (
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
