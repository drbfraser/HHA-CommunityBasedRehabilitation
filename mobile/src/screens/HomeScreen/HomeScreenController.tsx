import { stackParamList, stackScreenName } from "../../util/screens";
import HomeScreen from "./HomeScreen";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";

interface HomeScreenControllerProps {
    navigation: StackNavigationProp<stackParamList, stackScreenName.HOME>;
}

const HomeScreenController = (props: HomeScreenControllerProps) => {
    props.navigation.setOptions({
        title: "Main Menu",
        headerStyle: {
            backgroundColor: "#273263",
        },
        headerTintColor: "#fff",
        headerShown: true,
    });
    const onClientPress = () => props.navigation.navigate(stackScreenName.CLIENT);
    return <HomeScreen onClientPress={onClientPress}></HomeScreen>;
};

export default HomeScreenController;
