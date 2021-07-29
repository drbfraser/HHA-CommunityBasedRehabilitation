import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { Text, IconButton } from "react-native-paper";
import useStyles from "./UserList.styles";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { AppStackNavProp } from "../../util/stackScreens";
import { useNavigation } from "@react-navigation/core";
import { SearchOption, themeColors, useZones } from "@cbr/common";
import { StackScreenName } from "../../util/StackScreenName";
import { Picker } from "@react-native-picker/picker";
import { Searchbar } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { DataTable } from "react-native-paper";
import { fetchUsersFromApi, userBrife } from "./UserListRequest";
import { useIsFocused } from "@react-navigation/native";

const UserList = () => {
    const styles = useStyles();
    const authContext = useContext(AuthContext);
    const navigation = useNavigation<AppStackNavProp>();
    const zones = useZones();
    const [userList, setUserList] = useState<userBrife[]>([]);
    const [selectedSearchOption, setSearchOption] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const onChangeSearch = (query: React.SetStateAction<string>) => setSearchQuery(query);
    const [sortOption, setSortOption] = useState("");
    const [sortDirection, setIsSortDirection] = useState("None");
    const [currentDirection, setCurrentDirection] = useState(0);
    const sortDirections = ["asc", "dec", "None"];
    enum SortOptions {
        NAME = "name",
        ID = "id",
        ZONE = "zone",
        STATUS = "status",
        ROLE = "role",
    }

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

    const returnWrappedView = (item) => {
        return (
            <View style={styles.wrappedView}>
                <Text style={{ flexShrink: 1 }}>{item}</Text>
            </View>
        );
    };
    const theComparator = (a: userBrife, b: userBrife): number => {
        let result = 0;
        switch (sortOption) {
            case SortOptions.ID: {
                result = a.id - b.id;
                break;
            }
            case SortOptions.NAME: {
                result = a.full_name > b.full_name ? 1 : -1;
                break;
            }
            case SortOptions.ZONE: {
                result = a.zone > b.zone ? 1 : -1;
                break;
            }
            case SortOptions.ROLE: {
                result = a.role > b.role ? 1 : -1;
                break;
            }
            case SortOptions.STATUS: {
                result = a.status > b.status ? 1 : -1;
                break;
            }
            default: {
                break;
            }
        }
        return sortDirection === "asc" ? result : -1 * result;
    };

    const newUserListGet = async () => {
        var fetchedUserList = await fetchUsersFromApi(
            selectedSearchOption,
            searchQuery,
            sortOption,
            sortDirection
        );
        if (sortDirection !== "None") {
            fetchedUserList = fetchedUserList.sort(theComparator);
        }
        setUserList(fetchedUserList);
    };
    const isFocused = useIsFocused();
    useEffect(() => {
        authContext.requireLoggedIn(true);
        newUserListGet();
    }, [sortDirection, sortOption, searchQuery, selectedSearchOption, isFocused]);

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <IconButton
                    color={themeColors.bluePale}
                    icon="account-plus"
                    onPress={() => navigation.navigate(StackScreenName.ADMIN_NEW)}
                >
                    Create new user
                </IconButton>
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
                <Text style={styles.text}>Search by</Text>
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
                            onPress={() => sortBy(SortOptions.ID)}
                            sortDirection={arrowDirectionController(SortOptions.ID)}
                        >
                            ID
                        </DataTable.Title>
                        <DataTable.Title
                            style={styles.column_name}
                            onPress={() => sortBy(SortOptions.NAME)}
                            sortDirection={arrowDirectionController(SortOptions.NAME)}
                        >
                            Name
                        </DataTable.Title>
                        <DataTable.Title
                            style={styles.column_zone}
                            onPress={() => sortBy(SortOptions.ZONE)}
                            sortDirection={arrowDirectionController(SortOptions.ZONE)}
                        >
                            Zone
                        </DataTable.Title>
                        <DataTable.Title
                            style={styles.column_role}
                            onPress={() => sortBy(SortOptions.ROLE)}
                            sortDirection={arrowDirectionController(SortOptions.ROLE)}
                        >
                            Role
                        </DataTable.Title>
                        <DataTable.Title
                            style={styles.column_status}
                            onPress={() => sortBy(SortOptions.STATUS)}
                            sortDirection={arrowDirectionController(SortOptions.STATUS)}
                        >
                            Status
                        </DataTable.Title>
                    </DataTable.Header>
                    {userList.map((item) => {
                        return (
                            <DataTable.Row
                                style={styles.item}
                                key={item.id}
                                onPress={() => {
                                    navigation.navigate(StackScreenName.ADMIN_VIEW, {
                                        userID: Number(item.id),
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
                                <DataTable.Cell style={styles.column_role}>
                                    {item.role}
                                </DataTable.Cell>
                                <DataTable.Cell style={styles.column_status}>
                                    {item.status}
                                </DataTable.Cell>
                            </DataTable.Row>
                        );
                    })}
                </DataTable>
            </ScrollView>
        </View>
    );
};

export default UserList;
