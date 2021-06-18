import { useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as React from "react";
import { useState } from "react";
import { stackParamList, stackScreenName } from "../../util/screens";
import IndividualClientView from "./Client";
import { RouteProp } from "@react-navigation/native";
import { useEffect } from "react";

interface clientScreenControllerProps {
    route: RouteProp<stackParamList, stackScreenName.CLIENT>;
    navigation: StackNavigationProp<stackParamList, stackScreenName.CLIENT>;
}

const ClientScreenController = (props: clientScreenControllerProps) => {
    const [clientName, setClientName] = useState<String>("");
    useEffect(() => {
        setClientName(props.route.params.clientName);
    });

    return <IndividualClientView clientName={clientName} />;
};
export default ClientScreenController;
