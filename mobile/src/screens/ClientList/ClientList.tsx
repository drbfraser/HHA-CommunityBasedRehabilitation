import React, { useEffect } from "react";
import { Text, View, Switch } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { DataTable } from "react-native-paper";
import useStyles from "./ClientList.styles";
import { ClientTest, fetchClientsFromApi as fetchClientsFromApi } from "./ClientListRequest";
import { riskTypes } from "../../util/riskIcon";
import { useState } from "react";
import { Searchbar } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { SearchOption, themeColors, useZones } from "@cbr/common";
const styles = useStyles();
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { StackScreenName } from "../../util/StackScreenName";
import { AppStackNavProp } from "../../util/stackScreens";

enum SortOptions {
    ID = "id",
    NAME = "name",
    ZONE = "zone",
    HEALTH = "health",
    EDUCATION = "education",
    SOCIAL = "social",
}

const returnWrappedView = (item) => {
    return (
        <View style={styles.wrappedView}>
            <Text style={{ flexShrink: 1 }}>{item}</Text>
        </View>
    );
};

const ClientList = () => {
    const navigation = useNavigation<AppStackNavProp>();
    const [clientList, setClientList] = useState<ClientTest[]>([]);
    const [selectedSearchOption, setSearchOption] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [allClientsMode, setAllClientsMode] = useState<boolean>(true);
    const [sortDirection, setIsSortDirection] = useState("None");
    const [sortOption, setSortOption] = useState("");
    const zones = useZones();
    const sortDirections = ["asc", "dec", "None"];
    const [currentDirection, setCurrentDirection] = useState(0);
    const onChangeSearch = (query: React.SetStateAction<string>) => setSearchQuery(query);
    const getLevelByColor = (color: string) => {
        if (color == themeColors.riskGreen) {
            return 0;
        } else if (color == themeColors.riskYellow) {
            return 1;
        } else if (color == themeColors.riskRed) {
            return 4;
        } else if (color == themeColors.riskBlack) {
            return 13;
        }
        return 0;
    };
    const sortBy = async (option: string) => {
        if (option != sortOption) {
            setSortOption(option);
            setCurrentDirection(0);
            setIsSortDirection(sortDirections[currentDirection]);
        } else {
            setCurrentDirection(currentDirection + 1);
            if (currentDirection == 2) {
                setCurrentDirection(0);
            }
            setIsSortDirection(sortDirections[currentDirection]);
        }
    };
    const theComparator = (a: ClientTest, b: ClientTest): number => {
        if (sortOption == SortOptions.ID) {
            if (sortDirection == "asc") {
                return a.id - b.id;
            } else {
                return b.id - a.id;
            }
        } else if (sortOption == SortOptions.NAME) {
            if (sortDirection == "asc") {
                if (a.full_name > b.full_name) {
                    return 1;
                } else {
                    return -1;
                }
            } else {
                if (a.full_name < b.full_name) {
                    return 1;
                } else {
                    return -1;
                }
            }
        } else if (sortOption == SortOptions.ZONE) {
            if (sortDirection == "asc") {
                if (a.zone > b.zone) {
                    return 1;
                } else {
                    return -1;
                }
            } else {
                if (a.zone < b.zone) {
                    return 1;
                } else {
                    return -1;
                }
            }
        } else if (sortOption == SortOptions.HEALTH) {
            if (sortDirection == "asc") {
                if (getLevelByColor(a.HealthLevel) > getLevelByColor(b.HealthLevel)) {
                    return 1;
                } else {
                    return -1;
                }
            } else {
                if (getLevelByColor(a.HealthLevel) < getLevelByColor(b.HealthLevel)) {
                    return 1;
                } else {
                    return -1;
                }
            }
        } else if (sortOption == SortOptions.EDUCATION) {
            if (sortDirection == "asc") {
                if (getLevelByColor(a.EducationLevel) > getLevelByColor(b.EducationLevel)) {
                    return 1;
                } else {
                    return -1;
                }
            } else {
                if (getLevelByColor(a.EducationLevel) < getLevelByColor(b.EducationLevel)) {
                    return 1;
                } else {
                    return -1;
                }
            }
        } else if (sortOption == SortOptions.SOCIAL) {
            if (sortDirection == "asc") {
                if (getLevelByColor(a.SocialLevel) > getLevelByColor(b.SocialLevel)) {
                    return 1;
                } else {
                    return -1;
                }
            } else {
                if (getLevelByColor(a.SocialLevel) < getLevelByColor(b.SocialLevel)) {
                    return 1;
                } else {
                    return -1;
                }
            }
        }

        return 0;
    };
    const arrowDirectionController = (column_name: string) => {
        if (column_name == sortOption) {
            if (sortDirection == "asc") {
                return "ascending";
            } else if (sortDirection == "dec") {
                return "descending";
            } else {
                return undefined;
            }
        }
        return undefined;
    };
    const newClientGet = async () => {
        var exampleClient = await fetchClientsFromApi(
            selectedSearchOption,
            searchQuery,
            allClientsMode,
            sortOption,
            sortDirection
        );
        if (sortDirection !== "None") {
            exampleClient = exampleClient.sort(theComparator);
        }
        setClientList(exampleClient);
    };
    const isFocused = useIsFocused();
    useEffect(() => {
        newClientGet();
    }, [selectedSearchOption, searchQuery, allClientsMode, sortOption, sortDirection, isFocused]);
    useEffect(() => {
        var exampleClient = clientList;
        if (sortDirection !== "None") {
            exampleClient = exampleClient.sort(theComparator);
        }
        setClientList(exampleClient);
    }, [sortOption, sortDirection]);
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
                        <DataTable.Title
                            style={styles.column_id}
                            onPress={() => sortBy("id")}
                            sortDirection={arrowDirectionController("id")}
                        >
                            ID
                        </DataTable.Title>
                        <DataTable.Title
                            style={styles.column_name}
                            onPress={() => sortBy("name")}
                            sortDirection={arrowDirectionController("name")}
                        >
                            Name
                        </DataTable.Title>
                        <DataTable.Title
                            style={styles.column_zone}
                            onPress={() => sortBy("zone")}
                            sortDirection={arrowDirectionController("zone")}
                        >
                            Zone
                        </DataTable.Title>
                        <DataTable.Title
                            style={styles.column_icons}
                            onPress={() => sortBy("health")}
                            sortDirection={arrowDirectionController("health")}
                        >
                            {riskTypes.HEALTH.Icon("#000000")}
                        </DataTable.Title>
                        <DataTable.Title
                            style={styles.column_icons}
                            onPress={() => sortBy("education")}
                            sortDirection={arrowDirectionController("education")}
                        >
                            {riskTypes.EDUCAT.Icon("#000000")}
                        </DataTable.Title>
                        <DataTable.Title
                            style={styles.column_icons}
                            onPress={() => sortBy("social")}
                            sortDirection={arrowDirectionController("social")}
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
                                    navigation.navigate(StackScreenName.CLIENT, {
                                        clientID: item.id,
                                    });
                                }}
                            >
                                <DataTable.Cell style={styles.column_id}>{item.id}</DataTable.Cell>
                                <View style={styles.column_name}>
                                    {returnWrappedView(item.full_name)}
                                </View>
                                <View style={styles.column_zone}>
                                    {returnWrappedView(item.zone)}
                                </View>
                                <DataTable.Cell style={styles.column_icons}>
                                    {riskTypes.CIRCLE.Icon(item.HealthLevel)}
                                </DataTable.Cell>
                                <DataTable.Cell style={styles.column_icons}>
                                    {riskTypes.CIRCLE.Icon(item.EducationLevel)}
                                </DataTable.Cell>
                                <DataTable.Cell style={styles.column_icons}>
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
