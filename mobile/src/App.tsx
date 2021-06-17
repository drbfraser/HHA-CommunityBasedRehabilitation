import React from "react";
import { Provider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { screensForUser } from "./util/screens";
import theme from "./theme.styles";
import { createStackNavigator } from "@react-navigation/stack";
import ClientView from "./screens/Client/Client";
import { SafeAreaView } from "react-native-safe-area-context";
import { Platform } from "react-native";

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

function Home() {
    return (
        <Provider theme={theme}>
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
        </Provider>
    );
}

export default function App() {
    return (
        <SafeAreaView
            style={{
                flex: 1,
                paddingTop: Platform.OS === "android" ? 5 : 0,
            }}
        >
            <Provider theme={theme}>
                <NavigationContainer theme={theme}>
                    <Stack.Navigator>
                        {/* <{screensForUser(undefined).map((screen) => (
                        <Tab.Screen
                            key={screen.name}
                            name={screen.name}
                            component={screen.Component}
                            options={{ tabBarIcon: screen.iconName }}
                        />
                    ))}> */}
                        <Stack.Screen
                            name="Home"
                            component={Home}
                            options={{ title: "Main Menu" }}
                        />
                        <Stack.Screen
                            name="ClientDetails"
                            component={ClientView}
                            options={{ title: "Client Details" }}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </Provider>
        </SafeAreaView>
    );
}
