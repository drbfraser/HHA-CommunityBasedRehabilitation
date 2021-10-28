import React, { useContext, useEffect, useState } from "react";
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
import { useDatabase } from "@nozbe/watermelondb/hooks";

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
    const [zones, setZones] = useState<any>();
    const database = useDatabase();
    //Temp to until sync of zone to database implemented
    //start
    const zoneList = [
        "Bidi Bidi Zone 1",
        "Bidi Bidi Zone 2",
        "Bidi Bidi Zone 3",
        "Palorinya Basecamp",
        "Palorinya Zone 1",
    ];

    const fetchZone = async () => {
        const count = await database.get("zones").query().fetchCount();
        console.log(`zone count is ${count}`);
        if (count != 0) {
            const res = await database.get("zones").query();
            setZones(res);
        } else {
            console.log("preloading zones");
            database.write(async () => {
                zoneList.forEach((element) => {
                    console.log(`creating ${element}`);
                    database.get("zones").create((zone: any) => {
                        zone.zoneName = element;
                    });
                });
            });
        }
    };

    useEffect(() => {
        console.log("using effects");
        fetchZone();
        console.log(zones);
    }, []);
    //finish
    const Tab = createMaterialBottomTabNavigator();
    const { authState } = useContext(AuthContext);

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
