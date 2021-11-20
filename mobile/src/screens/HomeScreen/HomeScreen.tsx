import React, { useContext, useState } from "react";
import { Provider } from "react-native-paper";
import theme from "../../util/theme.styles";
import { AppStackNavProp, StackParamList } from "../../util/stackScreens";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { StackNavigationProp } from "@react-navigation/stack";
import useStyles from "./HomeScreen.style";
import { themeColors } from "@cbr/common/src/util/colors";
import { IUser, TAPILoadError, APILoadError, useZones } from "@cbr/common";
import { screens } from "../../util/screens";
import { StackScreenName } from "../../util/StackScreenName";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { SyncStackModal } from "../../components/SyncStackModal/SyncStackModal";
import { checkUnsyncedChanges } from "../../util/syncHandler";
import { SyncContext } from "../../context/SyncContext/SyncContext";
import { useNavigation } from "@react-navigation/native";

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
    const navigation = useNavigation<AppStackNavProp>();
    const { authState } = useContext(AuthContext);
    const syncAlert = useContext(SyncContext);
    const screenList = screensForUser(
        authState.state === "loggedIn" || authState.state === "previouslyLoggedIn"
            ? authState.currentUser
            : undefined
    );

    screenList.forEach((screen) => {
        if (screen.name == "Sync") {
            screen.iconBadge = syncAlert.unSyncedChanges;
        }
    });

    return (
        <BottomSheetModalProvider>
            <Provider theme={theme}>
                <Tab.Navigator>
                    {screenList.map((screen) => (
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
                            options={{ tabBarIcon: screen.iconName, tabBarBadge: screen.iconBadge }}
                        />
                    ))}
                </Tab.Navigator>
                <SyncStackModal
                    visible={modalVisible}
                    onModalDimss={(newVisibility) => {
                        setModalVisible(newVisibility);
                    }}
                    navigation={navigation}
                />
            </Provider>
        </BottomSheetModalProvider>
    );
};

export default HomeScreen;
