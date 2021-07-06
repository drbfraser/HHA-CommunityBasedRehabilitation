import { useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as React from "react";
import { useState } from "react";
import { stackParamList, StackScreenName } from "../../util/screens";
import ClientDTO from "./Client";
import { RouteProp } from "@react-navigation/native";
import { useEffect } from "react";
import useStyles from "./Client.styles";
import { ScrollView } from "react-native-gesture-handler";
import Client from "./Client";

const styles = useStyles();
interface clientScreenControllerProps {
    route: RouteProp<stackParamList, StackScreenName.CLIENT>;
    navigation: StackNavigationProp<stackParamList, StackScreenName.CLIENT>;
}

const ClientScreenController = (props: clientScreenControllerProps) => {
    React.useEffect(() => {
        props.navigation.setOptions({
            title: "Client Page",
            headerStyle: {
                backgroundColor: "#273263",
            },
            headerTintColor: "#fff",
            headerShown: true,
        });
    });
    return <Client clientID={props.route.params.clientID} />;

    //return <Client clientID={clientID} />;
};
export default ClientScreenController;
