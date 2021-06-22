import React, { useContext, useEffect } from "react";
import { View } from "react-native";
import { Button, Text, Title } from "react-native-paper";
import useStyles from "./Todo.styles";
import { AuthContext } from "../../context/AuthContext";

const Todo = () => {
    const styles = useStyles();
    const authContext = useContext(AuthContext);

    useEffect(() => {
        authContext.requireLoggedIn(true);
    }, []);

    return (
        <View style={styles.container}>
            <Title>This is a placeholder component screen.</Title>
            <Text>Due to be removed, once the app reaches completion!</Text>
            <Button mode="contained" onPress={authContext.logout}>
                Logout
            </Button>
        </View>
    );
};

export default Todo;
