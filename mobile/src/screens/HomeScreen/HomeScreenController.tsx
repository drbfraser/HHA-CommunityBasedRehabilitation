import { stackParamList, StackScreenName } from "../../util/screens";
import HomeScreen from "./HomeScreen";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";

interface HomeScreenControllerProps {
    navigation: StackNavigationProp<stackParamList, StackScreenName.HOME>;
}

const HomeScreenController = (props: HomeScreenControllerProps) => {
    React.useEffect(() => {
        props.navigation.setOptions({
            title: "Main Menu",
            headerStyle: {
                backgroundColor: "#273263",
            },
            headerTintColor: "#fff",
            headerShown: true,
        });
    });

    return <HomeScreen navigation={props.navigation}></HomeScreen>;
};

export default HomeScreenController;
