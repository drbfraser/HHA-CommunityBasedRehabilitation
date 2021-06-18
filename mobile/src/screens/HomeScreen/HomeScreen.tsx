import React from "react";
import { Provider } from "react-native-paper";
import theme from "../../util/theme.styles";
import { screensForUser } from "../../util/screens";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

interface HomeScreenProps {
    onClientPress: () => void;
}

const HomeScreen = (props: HomeScreenProps) => {
    const Tab = createMaterialBottomTabNavigator();
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
};

export default HomeScreen;
