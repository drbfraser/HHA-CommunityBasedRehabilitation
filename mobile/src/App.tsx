import React from "react";
import { Provider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { screensForUser } from "./util/screens";
import theme from "./theme.styles";
import { createNativeStackNavigator } from "react-native-screens/native-stack";
import Login from "./screens/Login/Login";

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();

const isLoggedIn = false;

export default function App() {
    return (
        <Provider theme={theme}>
            <NavigationContainer theme={theme}>
                {isLoggedIn ? (
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
                        <Stack.Screen
                            name="Login"
                            component={Login}
                            options={{ headerShown: false }}
                        />
                    </Stack.Navigator>
                )}
            </NavigationContainer>
        </Provider>
    );
}
