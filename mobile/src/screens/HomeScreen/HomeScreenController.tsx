import { stackParamList, stackScreenName } from "../../util/screens";
import HomeScreen from "./HomeScreen";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useContext } from "react";
import { View } from "react-native";
import { Button, Dialog, Paragraph, Portal } from "react-native-paper";
import { AuthContext } from "../../context/AuthContext/AuthContext";

interface HomeScreenControllerProps {
    navigation: StackNavigationProp<stackParamList, stackScreenName.HOME>;
}

const HomeScreenController = (props: HomeScreenControllerProps) => {
    {
        props.navigation.setOptions({
            title: "Main Menu",
            headerStyle: {
                backgroundColor: "#273263",
            },
            headerTintColor: "#fff",
            headerShown: true,
        });
    }

    const onClientPress = () => props.navigation.navigate(stackScreenName.CLIENT);
    return <HomeScreen navigation={props.navigation}></HomeScreen>;
};

export default HomeScreenController;
