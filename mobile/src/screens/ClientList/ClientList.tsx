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
import { SearchOption, themeColors, useZones, SortOptions } from "@cbr/common";

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
    const [searchQuery, setSearchQuery] = useState("");
    const [allClientsMode, setAllClientsMode] = useState<boolean>(true);
    const [sortDirection, setIsSortDirection] = useState("");
    const [sortOption, setSortOption] = useState("");
    const zones = useZones();
    const sortDirections = ["asc", "dec", "0"];
    var currentDirection = 0;
    const onChangeSearch = (query: React.SetStateAction<string>) => setSearchQuery(query);
    const newClientGet = async () => {
        const exampleClient = await fetchClientsFromApi(
            selectedSearchOption,
            searchQuery,
            allClientsMode,
            sortOption,
            sortDirection
        );
        console.log(exampleClient);
        setClientList(exampleClient);
    };
    const sortBy = async (option: string) => {
        if (option != sortOption) {
            setSortOption(option);
            currentDirection = 0;
            setIsSortDirection(sortDirections[currentDirection]);
        } else {
            currentDirection = (currentDirection + 1) % 3;

            setIsSortDirection(sortDirections[currentDirection]);
        }
    };

    useEffect(() => {
        newClientGet();
    }, [selectedSearchOption, searchQuery, allClientsMode, sortOption, sortDirection]);
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
                        <DataTable.Title style={styles.column_id} onPress={() => sortBy("id")}>
                            ID
                        </DataTable.Title>
                        <DataTable.Title style={styles.column_name} onPress={() => sortBy("name")}>
                            Name
                        </DataTable.Title>
                        <DataTable.Title style={styles.column_zone} onPress={() => sortBy("zone")}>
                            Zone
                        </DataTable.Title>
                        <DataTable.Title
                            style={styles.column_icons}
                            onPress={() => sortBy("health")}
                        >
                            {riskTypes.HEALTH.Icon("#000000")}
                        </DataTable.Title>
                        <DataTable.Title
                            style={styles.column_icons}
                            onPress={() => sortBy("education")}
                        >
                            {riskTypes.EDUCAT.Icon("#000000")}
                        </DataTable.Title>
                        <DataTable.Title
                            style={styles.column_icons}
                            onPress={() => sortBy("social")}
                        >
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
