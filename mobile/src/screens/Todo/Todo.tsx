import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Button, View } from "react-native";
import { Text, Title } from "react-native-paper";
import BaseSurvey from "./BaseSurvey/BaseSurvey";
import useStyles from "./Todo.styles";

const Todo = () => {
    const styles = useStyles();
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <Title>This is a placeholder component screen.</Title>
            <Text>Due to be removed, once the app reaches completion!</Text>
        </View>
    );
};

export default Todo;
