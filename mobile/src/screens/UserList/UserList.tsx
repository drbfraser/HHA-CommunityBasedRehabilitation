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
import { WrappedText } from "../../components/WrappedText/WrappedText";
import {
    SortOptions,
    sortBy,
    arrowDirectionController,
    userComparator,
} from "../../util/listFunctions";

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

    const userSortby = (option: string) => {
        sortBy(
            option,
            sortOption,
            setSortOption,
            currentDirection,
            setCurrentDirection,
            setIsSortDirection
        );
    };

    const userArrowDirectionController = (column_name: string) => {
        return arrowDirectionController(column_name, sortOption, sortDirection);
    };

    const userListScreenComparator = (a: userBrife, b: userBrife): number => {
        return userComparator(a, b, sortOption, sortDirection);
    };

    const newUserListGet = async () => {
        var fetchedUserList = await fetchUsersFromApi(
            selectedSearchOption,
            searchQuery,
            sortOption,
            sortDirection
        );
        if (sortDirection !== "None") {
            fetchedUserList = fetchedUserList.sort(userListScreenComparator);
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
                <Text style={styles.title}>Search by</Text>
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
                            onPress={() => userSortby(SortOptions.ID)}
                            sortDirection={userArrowDirectionController(SortOptions.ID)}
                        >
                            ID
                        </DataTable.Title>
                        <DataTable.Title
                            style={styles.column_name}
                            onPress={() => userSortby(SortOptions.NAME)}
                            sortDirection={userArrowDirectionController(SortOptions.NAME)}
                        >
                            Name
                        </DataTable.Title>
                        <DataTable.Title
                            style={styles.column_zone}
                            onPress={() => userSortby(SortOptions.ZONE)}
                            sortDirection={userArrowDirectionController(SortOptions.ZONE)}
                        >
                            Zone
                        </DataTable.Title>
                        <DataTable.Title
                            style={styles.column_role}
                            onPress={() => userSortby(SortOptions.ROLE)}
                            sortDirection={userArrowDirectionController(SortOptions.ROLE)}
                        >
                            Role
                        </DataTable.Title>
                        <DataTable.Title
                            style={styles.column_status}
                            onPress={() => userSortby(SortOptions.STATUS)}
                            sortDirection={userArrowDirectionController(SortOptions.STATUS)}
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
                                    <WrappedText
                                        text={item.full_name}
                                        viewStyle={styles.wrappedView}
                                        textStyle={styles.text}
                                    />
                                </View>
                                <View style={styles.column_zone}>
                                    <WrappedText
                                        text={item.zone}
                                        viewStyle={styles.wrappedView}
                                        textStyle={styles.text}
                                    />
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
