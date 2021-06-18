import { StackNavigationProp } from "@react-navigation/stack";
import * as React from "react";
import { useState } from "react";
import { stackParamList, stackScreenName } from "../../util/screens";
import IndividualClientView from "./Client";

interface clientScreenControllerProps {
    navigation: StackNavigationProp<stackParamList, stackScreenName.CLIENT>;
}

const ClientScreenController = (props: clientScreenControllerProps) => {
    const [clientName, setClientName] = useState<String>("");

    return <IndividualClientView clientName={clientName} />;
};
export default ClientScreenController;
