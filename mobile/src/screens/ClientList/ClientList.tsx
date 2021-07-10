import React, { useEffect } from "react";
import { View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { DataTable } from "react-native-paper";
import useStyles from "./ClientList.styles";
import { ClientTest, fetchClientsFromApi as fetchClientsFromApi } from "./ClientListRequest";
import { StackNavigationProp } from "@react-navigation/stack";
import { stackParamList, StackScreenName } from "../../util/screens";
import { riskTypes } from "../../util/riskIcon";
import { useState } from "react";
import { Searchbar } from "react-native-paper";

interface ClientListControllerProps {
    navigation: StackNavigationProp<stackParamList, StackScreenName.HOME>;
}

const ClientList = (props: ClientListControllerProps) => {
    const styles = useStyles();
    const [clientList, setClientList] = useState<ClientTest[]>([]);
    const [selectedSearchOption, setSearchOption] = useState("");
    const [searchQuery, setSearchQuery] = React.useState("");

    const onChangeSearch = (query) => setSearchQuery(query);

    const newClientGet = async () => {
        const exampleClient = await fetchClientsFromApi(selectedSearchOption, searchQuery);
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
                                props.navigation.navigate(StackScreenName.CLIENT, {
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
