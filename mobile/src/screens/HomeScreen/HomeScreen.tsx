import React, { useContext, useState } from "react";
import { Button, Provider } from "react-native-paper";
import theme from "../../util/theme.styles";
import { AppStackNavProp, StackParamList } from "../../util/stackScreens";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import useStyles from "./HomeScreen.style";
import { IUser, TAPILoadError, APILoadError, useZones } from "@cbr/common";
import { screens } from "../../util/screens";
import { StackScreenName } from "../../util/StackScreenName";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { TabModal } from "../../components/TabModal/TabModal";
import { SyncContext } from "../../context/SyncContext/SyncContext";
import { useNavigation } from "@react-navigation/native";
import { Icon, IconProps, withBadge } from "react-native-elements";
import { SyncModalIcon } from "./ModalIcon";
import { useTranslation } from "react-i18next";
import { Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

interface IHomeScreenProps {
    navigation: NativeStackNavigationProp<StackParamList, StackScreenName.HOME>;
}

const SyncIcon = () => {
    const syncAlert = useContext(SyncContext);
    const BadgedIcon = withBadge("")(Icon) as React.ComponentType<IconProps>;
    if (syncAlert.unSyncedChanges) {
        return <BadgedIcon type="material-community" name={SyncModalIcon.syncIcon} color="white" />;
    }
    return <Icon type="material-community" name={SyncModalIcon.syncIcon} color="white" />;
};

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
    const Tab = createBottomTabNavigator();
    const navigation = useNavigation<AppStackNavProp>();
    const { authState } = useContext(AuthContext);
    const syncAlert = useContext(SyncContext);
    const screenList = screensForUser(
        authState.state === "loggedIn" || authState.state === "previouslyLoggedIn"
            ? authState.currentUser
            : undefined
    );
    const { t } = useTranslation();

    screenList.forEach((screen) => {
        if (screen.name == "Sync") {
            screen.iconBadge = syncAlert.unSyncedChanges;
        }
    });

    return (
        <BottomSheetModalProvider>
            <Provider theme={theme}>
                <Tab.Navigator
                    screenOptions={{
                        headerShown: false,
                    }}
                >
                    {screenList.map((screen) => (
                        <Tab.Screen
                            key={screen.name}
                            name={screen.name}
                            component={screen.Component}
                            listeners={({ navigation, route }) => ({
                                tabPress: (e) => {
                                    if (route.name == "Sync") {
                                        e.preventDefault();
                                        setModalVisible(true);
                                    }
                                },
                            })}
                            options={{
                                tabBarIcon: ({ color, size }) => (
                                    <MaterialCommunityIcons
                                        name={screen.iconName as any}
                                        color={color}
                                        size={size}
                                    />
                                ),
                                tabBarBadge: screen.iconBadge ? "" : undefined,
                                tabBarLabel: screen.name === "Dashboard" ? "Dashboard" : undefined,
                            }}
                        />
                    ))}
                </Tab.Navigator>
                <TabModal
                    visible={modalVisible}
                    onModalDimss={(newVisibility) => {
                        setModalVisible(newVisibility);
                    }}
                    navigation={navigation}
                >
                    <Button
                        mode="contained"
                        icon={SyncIcon}
                        style={styles.buttonContainer}
                        onPress={() => {
                            props.navigation.navigate(StackScreenName.SYNC);
                        }}
                    >
                        {t("general.sync")}
                    </Button>
                    <Button
                        mode="contained"
                        icon={SyncModalIcon.alert}
                        style={styles.buttonContainer}
                        onPress={() => {
                            props.navigation.navigate(StackScreenName.ALERT_INBOX);
                        }}
                    >
                        {t("general.alerts")}
                    </Button>
                </TabModal>
            </Provider>
        </BottomSheetModalProvider>
    );
};

export default HomeScreen;
