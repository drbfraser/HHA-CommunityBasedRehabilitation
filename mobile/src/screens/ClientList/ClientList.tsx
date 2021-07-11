import React, { useEffect } from "react";
import { Text, View, Switch } from "react-native";
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
import { SearchOption } from "./searchOptions";
import { useZones } from "@cbr/common";

interface ClientListControllerProps {
    navigation: StackNavigationProp<stackParamList, StackScreenName.HOME>;
}

const test = (item) => {
    const name_array = item.full_name.split(" ");

    if (name_array.length == 1) {
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
    const [allClientsMode, setAllClientsMode] = useState<boolean>(true);
    const zones = useZones();

    const onChangeSearch = (query) => setSearchQuery(query);

    useEffect(() => {
        const newClientGet = async () => {
            const exampleClient = await fetchClientsFromApi(
                selectedSearchOption,
                searchQuery,
                allClientsMode
            );
            setClientList(exampleClient);
        };
        newClientGet();
    }, [selectedSearchOption, searchQuery, allClientsMode]);
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                {selectedSearchOption === SearchOption.ZONE ? (
                    <Picker
                        style={styles.select}
                        selectedValue={searchQuery}
                        onValueChange={(itemValue, itemIndex) => setSearchQuery(itemValue)}
                    >
                        <Picker.Item label="N/A" value="" />
                        {Array.from(zones).map(([id, name]) => (
                            <Picker.Item key={id} label={name} value={id} />
                        ))}
                    </Picker>
                ) : (
                    <Searchbar
                        style={styles.search}
                        placeholder="Search"
                        onChangeText={onChangeSearch}
                        value={searchQuery}
                    />
                )}
            </View>
            <View style={styles.row}>
                <Text style={{ flex: 0.7, paddingLeft: 10 }}>My Clients</Text>
                <Switch
                    style={{ flex: 0.2 }}
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={allClientsMode ? "#f5dd4b" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={setAllClientsMode}
                    value={allClientsMode}
                />
                <Text style={{ flex: 1 }}>All Clients</Text>

                <Text style={{ textAlign: "center", fontSize: 16 }}>Filter by</Text>
                <Picker
                    style={styles.select}
                    selectedValue={selectedSearchOption}
                    onValueChange={(itemValue, itemIndex) => {
                        setSearchOption(itemValue);
                        setSearchQuery("");
                    }}
                >
                    <Picker.Item label="N/A" value="" />
                    <Picker.Item label="ID" value={SearchOption.ID} />
                    <Picker.Item label="Name" value={SearchOption.NAME} />
                    <Picker.Item label="Zone" value={SearchOption.ZONE} />
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
