import React, { useContext } from "react";
import { Provider } from "react-native-paper";
import theme from "../../util/theme.styles";
import { screensForUser, stackParamList, StackScreenName } from "../../util/screens";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { Alert } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import useStyles from "./HomeScreen.style";
import { themeColors } from "@cbr/common/src/util/colors";

interface HomeScreenProps {
    navigation: StackNavigationProp<stackParamList, StackScreenName.HOME>;
}

const HomeScreen = (props: HomeScreenProps) => {
    const styles = useStyles();
    React.useEffect(() => {
        props.navigation.setOptions({
            title: "Main Menu",
            headerStyle: {
                backgroundColor: themeColors.blueBgDark,
            },
            headerTintColor: themeColors.blueAccent,
            headerShown: true,
        });
    });

    const Tab = createMaterialBottomTabNavigator();
    const { authState } = useContext(AuthContext);

    React.useEffect(() => {
        props.navigation.setOptions({
            title: "Main Menu",
            headerStyle: styles.headerStyle,
            headerTintColor: themeColors.white,
            headerShown: true,
        });
    });

    return (
        <Provider theme={theme}>
            <Tab.Navigator>
                {screensForUser(
                    authState.state === "loggedIn" || authState.state === "previouslyLoggedIn"
                        ? authState.currentUser
                        : undefined
                ).map((screen) => (
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
