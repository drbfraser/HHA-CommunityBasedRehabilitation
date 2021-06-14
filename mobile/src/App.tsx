import React from "react";
import { Provider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { screensForUser } from "./util/screens";
import theme from "./theme.styles";

const Tab = createMaterialBottomTabNavigator();

export default function App() {
  return (
    <Provider theme={theme}>
      <NavigationContainer theme={theme}>
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
