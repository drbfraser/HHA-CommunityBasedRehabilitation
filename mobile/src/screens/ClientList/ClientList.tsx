import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { DataTable } from "react-native-paper";
import useStyles from "./ClientList.styles";
import { ClientTest, fetchClientsFromApi as fetchClientsFromApi } from "./ClientListRequest";
import { StackNavigationProp } from "@react-navigation/stack";
import { stackParamList, StackScreenName } from "../../util/screens";
import { riskTypes } from "../../util/riskIcon";
import { useState } from "react";
import { Searchbar } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { Item } from "react-native-paper/lib/typescript/components/List/List";

interface ClientListControllerProps {
    navigation: StackNavigationProp<stackParamList, StackScreenName.HOME>;
}

const test = (item) => {
    const name_array = item.full_name.split(" ");

    if (name_array.length == 1) {
        console.log(name_array.length);
        return (
            <View>
                <Text key={name_array[0]}>{name_array[0]}</Text>
            </View>
        );
    } else {
        return (
            <View>
                <Text>{name_array[0]}</Text>
                <Text>{name_array[name_array.length - 1]}</Text>
            </View>
        );
    }
};

const ClientList = (props: ClientListControllerProps) => {
    const styles = useStyles();
    const [clientList, setClientList] = useState<ClientTest[]>([]);
    const [selectedSearchOption, setSearchOption] = useState("");
    const [searchQuery, setSearchQuery] = React.useState("");

    const onChangeSearch = (query) => setSearchQuery(query);

    useEffect(() => {
        const newClientGet = async () => {
            const exampleClient = await fetchClientsFromApi(selectedSearchOption, searchQuery);
            setClientList(exampleClient);
        };
        newClientGet();
    }, [selectedSearchOption, searchQuery]);

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Searchbar
                    style={styles.search}
                    placeholder="Search"
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                />
            </View>
            <View style={styles.row}>
                <View style={{ flex: 1, alignContent: "center", justifyContent: "center" }}>
                    <Text style={{ textAlign: "center", fontSize:18 }}>Filter by</Text>
                </View>
                <Picker
                    style={styles.select}
                    selectedValue={selectedSearchOption}
                    onValueChange={(itemValue, itemIndex) => setSearchOption(itemValue)}
                >
                    <Picker.Item label="N/A" value="" />
                    <Picker.Item label="ID" value="id" />
                    <Picker.Item label="Name" value="full_name" />
                    <Picker.Item label="Zone" value="zone" />
                </Picker>
            </View>
            <ScrollView>
                <DataTable>
                    <DataTable.Header style={styles.item}>
                        <DataTable.Title style={{ flex: 0.7 }}>ID</DataTable.Title>
                        <DataTable.Title style={{ flex: 2 }}>Name</DataTable.Title>
                        <DataTable.Title style={{ flex: 2 }}>Zone</DataTable.Title>
                        <DataTable.Title style={{ flex: 1 }}>
                            {riskTypes.HEALTH.name}
                        </DataTable.Title>
                        <DataTable.Title style={{ flex: 1 }}>
                            {riskTypes.EDUCAT.name}
                        </DataTable.Title>
                        <DataTable.Title style={{ flex: 1 }}>
                            {riskTypes.SOCIAL.name}
                        </DataTable.Title>
                    </DataTable.Header>
                    {clientList.map((item) => {
                        return (
                            <DataTable.Row
                                style={styles.item}
                                key={item.id} // you need a unique key per item
                                onPress={() => {
                                    props.navigation.navigate(StackScreenName.CLIENT, {
                                        clientID: item.id,
                                    });
                                }}
                            >
                                <DataTable.Cell style={{ flex: 0.7 }}>{item.id}</DataTable.Cell>
                                <View style={{ flex: 1.5 }}>{test(item)}</View>
                                <DataTable.Cell style={{ flex: 2 }}>{item.zone}</DataTable.Cell>
                                <DataTable.Cell style={{ flex: 0.8 }}>
                                    {riskTypes.HEALTH.Icon(item.HealthLevel)}
                                </DataTable.Cell>
                                <DataTable.Cell style={{ flex: 0.8 }}>
                                    {riskTypes.EDUCAT.Icon(item.EducationLevel)}
                                </DataTable.Cell>
                                <DataTable.Cell style={{ flex: 0.8 }}>
                                    {riskTypes.SOCIAL.Icon(item.SocialLevel)}
                                </DataTable.Cell>
                            </DataTable.Row>
                        );
                    })}
                </DataTable>
            </ScrollView>
        </View>
    );
};
export default ClientList;
