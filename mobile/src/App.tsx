import React from "react";
import { Provider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import theme from "./util/theme.styles";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import globalStyle from "./app.styles";
import { stackScreenName, stackScreenProps } from "./util/screens";

const Stack = createStackNavigator();
const styles = globalStyle();

export default function App() {
    return (
        <SafeAreaView style={styles.safeApp}>
            <Provider theme={theme}>
                <NavigationContainer theme={theme}>
                    <Stack.Navigator
                        initialRouteName={stackScreenName.HOME}
                        screenOptions={{
                            headerShown: true,
                            title: "Main Menu",
                        }}
                    >
                        {Object.values(stackScreenName).map((name) => (
                            <Stack.Screen
                                key={name}
                                name={name}
                                component={stackScreenProps[name]}
                            />
                        ))}
                    </Stack.Navigator>
                </NavigationContainer>
            </Provider>
        </SafeAreaView>
    );
}
