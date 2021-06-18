import React from "react";
import { Appbar, Provider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { screensForUser } from "./util/screens";
import theme from "./theme.styles";
import { MaterialIcons } from "@expo/vector-icons";

const Tab = createMaterialBottomTabNavigator();

export default function App() {
    return (
        <Provider theme={theme}>
            <NavigationContainer theme={theme}>
                <Appbar.Header statusBarHeight={25}>
                    <MaterialIcons name="arrow-back" size={25} color="#FFFFFF" />
                    <Appbar.Content title={"Baseline Survey"} />
                </Appbar.Header>
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
            </NavigationContainer>
        </Provider>
    );
}
