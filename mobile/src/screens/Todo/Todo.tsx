import React, { useContext, useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { Button, Text, TextInput, Title, IconButton } from "react-native-paper";
import useStyles from "./Todo.styles";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { AppStackNavProp } from "../../util/stackScreens";
import { useNavigation } from "@react-navigation/core";
import { SearchOption, themeColors, useCurrentUser, useDisabilities, useZones } from "@cbr/common";
import { StackScreenName } from "../../util/StackScreenName";
import { Picker } from "@react-native-picker/picker";
import { Searchbar } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { DataTable } from "react-native-paper";
import { fetchUsersFromApi, userBrife } from "./UserListRequest";
import { SortOptions, userRoles } from "@cbr/common";
import { Colors } from "react-native/Libraries/NewAppScreen";

const Todo = () => {
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
        } else if (sortOption == SortOptions.ROLE) {
            if (sortDirection == "asc") {
                if (a.role > b.role) {
                    return 1;
                } else {
                    return -1;
                }
            } else {
                if (a.role < b.role) {
                    return 1;
                } else {
                    return -1;
                }
            }
        } else if (sortOption == SortOptions.STATUS) {
            if (sortDirection == "asc") {
                if (a.Status > b.Status) {
                    return 1;
                } else {
                    return -1;
                }
            } else {
                if (a.Status < b.Status) {
                    return 1;
                } else {
                    return -1;
                }
            }
        }
        return 0;
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

    useEffect(() => {
        authContext.requireLoggedIn(true);
        newUserListGet();
    }, [sortDirection, sortOption, searchQuery, selectedSearchOption]);

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <IconButton
                    color={themeColors.bluePale}
                    icon="account-plus"
                    onPress={() => navigation.navigate(StackScreenName.ADMIN_NEW)}
                    style={styles.addUserIcon}
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
                <Text style={{ textAlign: "center", fontSize: 16 }}>Search by</Text>
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
                            style={styles.column_role}
                            onPress={() => sortBy("role")}
                            sortDirection={arrowDirectionController("role")}
                        >
                            Role
                        </DataTable.Title>
                        <DataTable.Title
                            style={styles.column_status}
                            onPress={() => sortBy("status")}
                            sortDirection={arrowDirectionController("status")}
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

export default Todo;
