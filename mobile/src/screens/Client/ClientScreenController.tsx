import { useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as React from "react";
import { useState } from "react";
import { stackParamList, stackScreenName } from "../../util/screens";
import IndividualClientView from "./Client";
import { RouteProp } from "@react-navigation/native";
import { useEffect } from "react";
import useStyles from "./Client.styles";
import { ScrollView } from "react-native-gesture-handler";

const styles = useStyles();
interface clientScreenControllerProps {
    route: RouteProp<stackParamList, stackScreenName.CLIENT>;
    navigation: StackNavigationProp<stackParamList, stackScreenName.CLIENT>;
}

const ClientScreenController = (props: clientScreenControllerProps) => {
    props.navigation.setOptions({
        title: "Client Details",
        headerStyle: {
            backgroundColor: "#273263",
        },
        headerTintColor: "#fff",
        headerShown: true,
    });
    const [clientID, setClientID] = useState<number>(0);
    useEffect(() => {
        setClientID(props.route.params.clientID);
    });

    return <IndividualClientView clientID={clientID} />;
};
export default ClientScreenController;
