import React, { useContext, useCallback, useEffect, useMemo, useRef } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Provider } from "react-native-paper";
import theme from "../../util/theme.styles";
import { StackParamList } from "../../util/stackScreens";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { StackNavigationProp } from "@react-navigation/stack";
import useStyles from "./HomeScreen.style";
import { themeColors } from "@cbr/common/src/util/colors";
import { IUser, TAPILoadError, APILoadError, useZones } from "@cbr/common";
import { screens } from "../../util/screens";
import { StackScreenName } from "../../util/StackScreenName";
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";

interface IHomeScreenProps {
    navigation: StackNavigationProp<StackParamList, StackScreenName.HOME>;
}

const screensForUser = (user: IUser | TAPILoadError | undefined) => {
    return screens.filter((screen) => {
        if (!screen.roles) {
            return true;
        }

        if (!user || user === APILoadError) {
            return false;
        }

        return screen.roles.includes(user.role);
    });
};

const HomeScreen = (props: IHomeScreenProps) => {
    const styles = useStyles();
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ["25%", "50%"], []);

    const Tab = createMaterialBottomTabNavigator();
    const { authState } = useContext(AuthContext);

    const handleSheetChanges = useCallback((index: number) => {
        console.log("handleSheetChanges", index);
    }, []);

    return (
        <BottomSheetModalProvider>
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
                            listeners={({ navigation, route }) => ({
                                tabPress: (e) => {
                                    if (route.name == "Profile") {
                                        console.log("prevented");
                                        e.preventDefault();
                                        bottomSheetModalRef.current?.present();
                                    }
                                },
                            })}
                            options={{ tabBarIcon: screen.iconName }}
                        />
                    ))}
                </Tab.Navigator>
                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    index={1}
                    snapPoints={snapPoints}
                    onChange={handleSheetChanges}
                >
                    <View style={styles.contentContainer}>
                        <Text>Placeholder to put sync button and/or alert navigation</Text>
                    </View>
                </BottomSheetModal>
            </Provider>
        </BottomSheetModalProvider>
    );
};

export default HomeScreen;
