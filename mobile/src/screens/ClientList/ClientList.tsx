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
import { SearchOption, themeColors, useZones } from "@cbr/common";

interface ClientListControllerProps {
    navigation: StackNavigationProp<stackParamList, StackScreenName.HOME>;
}

const returnWrapedView = (item) => {
    return (
        <View style={{ flexDirection: "row", flex: 1.5, alignItems: "center", padding: 5 }}>
            <Text style={{ flexShrink: 1 }}>{item}</Text>
        </View>
    );
};

const ClientList = (props: ClientListControllerProps) => {
    const styles = useStyles();
    const [clientList, setClientList] = useState<ClientTest[]>([]);
    const [selectedSearchOption, setSearchOption] = useState("");
    const [searchQuery, setSearchQuery] = React.useState("");
    const [allClientsMode, setAllClientsMode] = useState<boolean>(true);
    const zones = useZones();

    const onChangeSearch = (query: React.SetStateAction<string>) => setSearchQuery(query);

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
                    trackColor={{ false: themeColors.yellow, true: themeColors.yellow }}
                    thumbColor={allClientsMode ? themeColors.white : themeColors.white}
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
                        <DataTable.Title style={styles.column_id}>ID</DataTable.Title>
                        <DataTable.Title style={styles.column_name}>Name</DataTable.Title>
                        <DataTable.Title style={styles.column_zone}>Zone</DataTable.Title>
                        <DataTable.Title style={styles.column_icons}>
                            {riskTypes.HEALTH.Icon("#000000")}
                        </DataTable.Title>
                        <DataTable.Title style={styles.column_icons}>
                            {riskTypes.EDUCAT.Icon("#000000")}
                        </DataTable.Title>
                        <DataTable.Title style={styles.column_icons}>
                            {riskTypes.SOCIAL.Icon("#000000")}
                        </DataTable.Title>
                    </DataTable.Header>
                    {clientList.map((item) => {
                        return (
                            <DataTable.Row
                                style={styles.item}
                                key={item.id}
                                onPress={() => {
                                    props.navigation.navigate(StackScreenName.CLIENT, {
                                        clientID: item.id,
                                    });
                                }}
                            >
                                <DataTable.Cell style={{ flex: 0.7 }}>{item.id}</DataTable.Cell>
                                <View style={{ flex: 1.5 }}>
                                    {returnWrapedView(item.full_name)}
                                </View>
                                <View style={{ flex: 1.5 }}>{returnWrapedView(item.zone)}</View>
                                <DataTable.Cell style={{ flex: 0.8 }}>
                                    {riskTypes.CIRCLE.Icon(item.HealthLevel)}
                                </DataTable.Cell>
                                <DataTable.Cell style={{ flex: 0.8 }}>
                                    {riskTypes.CIRCLE.Icon(item.EducationLevel)}
                                </DataTable.Cell>
                                <DataTable.Cell style={{ flex: 0.8 }}>
                                    {riskTypes.CIRCLE.Icon(item.SocialLevel)}
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
