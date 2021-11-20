import React, { useContext, useCallback, useState } from "react";
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
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { SyncStackModal } from "../SyncStackModal/SyncStackModal";

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
    const [modalVisible, setModalVisible] = useState<boolean>(false);
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
                                    if (route.name == "Sync") {
                                        console.log("prevented");
                                        e.preventDefault();
                                        setModalVisible(true);
                                    }
                                },
                            })}
                            options={{ tabBarIcon: screen.iconName }}
                        />
                    ))}
                </Tab.Navigator>
                <SyncStackModal
                    visible={modalVisible}
                    onModalDimss={(newVisibility) => {
                        setModalVisible(newVisibility);
                    }}
                />
            </Provider>
        </BottomSheetModalProvider>
    );
};

export default HomeScreen;
