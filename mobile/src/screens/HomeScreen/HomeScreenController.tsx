import { stackParamList, stackScreenName } from "../../util/screens";
import HomeScreen from "./HomeScreen";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";

interface HomeScreenControllerProps {
    navigation: StackNavigationProp<stackParamList, stackScreenName.HOME>;
}

const HomeScreenController = (props: HomeScreenControllerProps) => {
    const onClientPress = () => props.navigation.navigate(stackScreenName.CLIENT);
    return <HomeScreen onClientPress={onClientPress}></HomeScreen>;
};

export default HomeScreenController;
