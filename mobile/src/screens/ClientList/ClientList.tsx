import React from "react";
import { View } from "react-native";
import { DataTable } from "react-native-paper";
import useStyles from "./ClientList.styles";
import { ClientTest, fetchClientsFromApi as fetchClientsFromApi } from "./ClientListRequest";
import { riskLevels } from "../../util/risks";
import { StackNavigationProp } from "@react-navigation/stack";
import { stackParamList, stackScreenName } from "../../util/screens";
import { riskTypes } from "../../util/riskIcon";
import { useState } from "react";
interface ClientListControllerProps {
    navigation: StackNavigationProp<stackParamList, stackScreenName.HOME>;
}

const ClientList = (props: ClientListControllerProps) => {
    const styles = useStyles();
    const [clientList, setClientList] = useState<ClientTest[]>([]);
    const newClientGet = async () => {
        const exampleClient = await fetchClientsFromApi();
        setClientList(exampleClient);
    };
    newClientGet();

    return (
        <View style={styles.container}>
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>ID</DataTable.Title>
                    <DataTable.Title>Name</DataTable.Title>
                    <DataTable.Title>Zone</DataTable.Title>
                    <DataTable.Title>{riskTypes.HEALTH.name}</DataTable.Title>
                    <DataTable.Title>{riskTypes.EDUCAT.name}</DataTable.Title>
                    <DataTable.Title>{riskTypes.SOCIAL.name}</DataTable.Title>
                </DataTable.Header>
                {clientList.map((item) => {
                    return (
                        <DataTable.Row
                            key={item.id} // you need a unique key per item
                            onPress={() => {
                                props.navigation.navigate(stackScreenName.CLIENT, {
                                    clientID: item.id,
                                });
                            }}
                        >
                            <DataTable.Cell>{item.id}</DataTable.Cell>
                            <DataTable.Cell style={styles.item}>{item.full_name}</DataTable.Cell>
                            <DataTable.Cell style={styles.item}>{item.zone}</DataTable.Cell>
                            <DataTable.Cell>
                                {riskTypes.HEALTH.Icon(item.HealthLevel)}
                            </DataTable.Cell>
                            <DataTable.Cell>
                                {riskTypes.EDUCAT.Icon(item.EducationLevel)}
                            </DataTable.Cell>
                            <DataTable.Cell>
                                {riskTypes.SOCIAL.Icon(item.SocialLevel)}
                            </DataTable.Cell>
                        </DataTable.Row>
                    );
                })}
            </DataTable>
        </View>
    );
};

export default ClientList;
