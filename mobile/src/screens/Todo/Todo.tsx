import React, { useContext, useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { Button, Text, TextInput, Title } from "react-native-paper";
import useStyles from "./Todo.styles";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { AppStackNavProp } from "../../util/stackScreens";
import { useNavigation } from "@react-navigation/core";
import { useCurrentUser, useDisabilities, useZones } from "@cbr/common";
import { StackScreenName } from "../../util/StackScreenName";

const Todo = () => {
    const styles = useStyles();
    const authContext = useContext(AuthContext);

    useEffect(() => {
        authContext.requireLoggedIn(true);
    }, []);
    const navigation = useNavigation<AppStackNavProp>();
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

    const [userId, setUserId] = useState<string>();
    const [count, setCount] = useState(0);
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

            {/* TODO: Remove this when admin user list is created */}
            <TextInput
                style={styles.userIdTextInput}
                value={userId}
                onChangeText={setUserId}
                onSubmitEditing={() => {
                    if (userId) {
                        navigation.navigate(StackScreenName.ADMIN_VIEW, { userID: Number(userId) });
                    }
                }}
                keyboardType="number-pad"
                label="User ID to open"
            />

            {/* TODO: Remove this when admin user list is created */}
            <Button
                mode="contained"
                disabled={!userId}
                onPress={() => {
                    if (userId) {
                        navigation.navigate(StackScreenName.ADMIN_VIEW, { userID: Number(userId) });
                    }
                }}
            >
                View user as admin
            </Button>

            {/* TODO: Remove this when admin user list is created */}
            <Button mode="contained" onPress={() => navigation.navigate(StackScreenName.ADMIN_NEW)}>
                Create new user
            </Button>
        </View>
    );
};

export default Todo;
