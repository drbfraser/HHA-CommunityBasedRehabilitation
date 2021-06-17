import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { Button, Text, Title } from "react-native-paper";
import useStyles from "./Todo.styles";
import { AuthContext } from "../../context/AuthContext";
import { getAuthToken } from "@cbr/common";

const Todo = () => {
    const styles = useStyles();
    const authContext = useContext(AuthContext);
    const [isRefreshTokenValid, setRefreshTokenValid] = useState<boolean>();

    useEffect(() => {
        const checkRefreshToken = async () => {
            // getAuthToken might make a call to /api/login/refresh
            const authToken = await getAuthToken();
            setRefreshTokenValid(authToken != null);
        };
        checkRefreshToken();
    });

    return (
        <View style={styles.container}>
            <Title>This is a placeholder component screen.</Title>
            <Text>Due to be removed, once the app reaches completion!</Text>
            {isRefreshTokenValid !== undefined ? (
                <Text>Refresh and auth tokens valid? {`${isRefreshTokenValid}`}</Text>
            ) : (
                <></>
            )}
            <Button mode="contained" onPress={authContext.logout}>
                Logout
            </Button>
        </View>
    );
};

export default Todo;
