import React, { useContext, useEffect } from "react";
import { Alert, View } from "react-native";
import { Button, Text, Title } from "react-native-paper";
import useStyles from "./Todo.styles";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { stackParamList, StackScreenName } from "../../util/stackScreens";
import { Navigation } from "react-native-navigation";
import { useNavigation } from "@react-navigation/core";
import { useZones } from "@cbr/common";
import { useCurrentUser, useDisabilities } from "@cbr/common";

interface LogoutProps {
    navigation: StackNavigationProp<stackParamList, StackScreenName.HOME>;
}

const Todo = (props: LogoutProps) => {
    const styles = useStyles();
    const authContext = useContext(AuthContext);

    useEffect(() => {
        authContext.requireLoggedIn(true);
    }, []);
    const navigation = useNavigation();
    const logoutAlert = () =>
        Alert.alert("Alert", "Do you want to logout?", [
            {
                text: "Don't logout",
                style: "cancel",
            },
            { text: "Logout", onPress: () => authContext.logout() },
        ]);

    const zones = useZones();
    const disabilities = useDisabilities();
    const currentUser = useCurrentUser();

    return (
        <View style={styles.container}>
            <Title>This is a placeholder component screen.</Title>
            <Text>Due to be removed, once the app reaches completion!</Text>
            <Button
                mode="contained"
                onPress={() => {
                    logoutAlert();
                }}
            >
                Logout
            </Button>

            <Text>Zones hook: {JSON.stringify(Array.from(zones))}</Text>
            <Text>Disabilities hook: {JSON.stringify(Array.from(disabilities))}</Text>
            <Text>Current user hook: {JSON.stringify(currentUser)}</Text>
        </View>
    );
};

export default Todo;
