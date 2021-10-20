import React, { useContext, useEffect, useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { Text, IconButton, Portal, Modal } from "react-native-paper";
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
import BriefUser, { fetchUsersFromApi } from "./UserListRequest";
import { useIsFocused } from "@react-navigation/native";
import { WrappedText } from "../../components/WrappedText/WrappedText";
import {
    SortOptions,
    sortBy,
    arrowDirectionController,
    userComparator,
    TSortDirection,
} from "../../util/listFunctions";
import CustomMultiPicker from "react-native-multiple-select-list";

const UserList = () => {
    const styles = useStyles();
    const authContext = useContext(AuthContext);
    const navigation = useNavigation<AppStackNavProp>();
    const zones = useZones();
    const [userList, setUserList] = useState<BriefUser[]>([]);
    const [selectedSearchOption, setSearchOption] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const onChangeSearch = (query: React.SetStateAction<string>) => setSearchQuery(query);
    const [sortOption, setSortOption] = useState("");
    const [sortDirection, setIsSortDirection] = useState<TSortDirection>("None");

    const [showColumnBuilderMenu, setShowColumnBuilderMenu] = useState(false);

    const [showIDColumn, setShowIDColumn] = useState(true);
    const [showNameColumn, setShowNameColumn] = useState(true);
    const [showZoneColumn, setShowZoneColumn] = useState(true);
    const [showRoleColumn, setShowRoleColumn] = useState(true);
    const [showStatusColumn, setShowStatusColumn] = useState(true);

    const [selectedColumn, setSelectedColumn] = useState<String[]>(["0", "1", "2", "3", "4"]);
    const columnShowingList = [
        setShowIDColumn,
        setShowNameColumn,
        setShowZoneColumn,
        setShowRoleColumn,
        setShowStatusColumn,
    ];
    const columnList = { 0: "ID", 1: "Name", 2: "Zone", 3: "Role", 4: "Statue" };
    const openColumnBuilderMenu = () => {
        setShowColumnBuilderMenu(true);
        showSelectedColumn;
    };
    const closeColumnBuilderMenu = () => {
        setShowColumnBuilderMenu(false);
        showSelectedColumn;
    };

    const userSortBy = (option: string) => {
        sortBy(option, sortOption, sortDirection, setSortOption, setIsSortDirection);
    };

    const userArrowDirectionController = (column_name: string) => {
        return arrowDirectionController(column_name, sortOption, sortDirection);
    };

    const userListScreenComparator = (a: BriefUser, b: BriefUser): number => {
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

    const showSelectedColumn = () => {
        columnShowingList.forEach((element, index) => {
            element(selectedColumn.includes(String(index)));
        });
    };

    useEffect(() => {
        if (isFocused) {
            authContext.requireLoggedIn(true);
            newUserListGet();
        }
    }, [sortDirection, sortOption, searchQuery, selectedSearchOption, isFocused]);
    useEffect(() => {
        showSelectedColumn();
    }, [selectedColumn]);
    const ShowTitle = (props: {
        label: string | JSX.Element;
        style: StyleProp<ViewStyle>;
        showTheTitle: boolean;
        thisColumnSortOption: SortOptions;
    }) => {
        if (props.showTheTitle) {
            return (
                <DataTable.Title
                    style={props.style}
                    onPress={() => userSortBy(props.thisColumnSortOption)}
                    sortDirection={userArrowDirectionController(props.thisColumnSortOption)}
                >
                    {props.label}
                </DataTable.Title>
            );
        } else {
            return <View></View>;
        }
    };

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
                        onValueChange={(itemValue) => setSearchQuery(itemValue)}
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
                <IconButton
                    icon="dots-vertical"
                    color={themeColors.borderGray}
                    size={20}
                    style={styles.columnBuilderButton}
                    onPress={openColumnBuilderMenu}
                />
                <Portal>
                    <Modal
                        visible={showColumnBuilderMenu}
                        onDismiss={closeColumnBuilderMenu}
                        style={styles.colonBuilderChecklist}
                    >
                        <CustomMultiPicker
                            options={columnList}
                            multiple={true}
                            placeholder={"Select columns"}
                            placeholderTextColor={themeColors.blueBgLight}
                            returnValue={"value"}
                            callback={(label) => {
                                setSelectedColumn(label);
                                showSelectedColumn();
                            }}
                            rowBackgroundColor={themeColors.blueBgLight}
                            iconSize={30}
                            selectedIconName={"checkmark-circle"}
                            unselectedIconName={"radio-button-off"}
                            selected={selectedColumn.map(String)}
                        />
                    </Modal>
                </Portal>
            </View>
            <ScrollView>
                <DataTable>
                    <DataTable.Header style={styles.item}>
                        <ShowTitle
                            label="ID"
                            style={styles.column_id}
                            showTheTitle={showIDColumn}
                            thisColumnSortOption={SortOptions.ID}
                        />
                        <ShowTitle
                            label="Name"
                            style={styles.column_name}
                            showTheTitle={showNameColumn}
                            thisColumnSortOption={SortOptions.NAME}
                        />
                        <ShowTitle
                            label="Zone"
                            style={styles.column_zone}
                            showTheTitle={showZoneColumn}
                            thisColumnSortOption={SortOptions.ZONE}
                        />
                        <ShowTitle
                            label="Role"
                            style={styles.column_role}
                            showTheTitle={showRoleColumn}
                            thisColumnSortOption={SortOptions.ROLE}
                        />
                        <ShowTitle
                            label="Status"
                            style={styles.column_status}
                            showTheTitle={showStatusColumn}
                            thisColumnSortOption={SortOptions.STATUS}
                        />
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
                                {showIDColumn ? (
                                    <DataTable.Cell style={styles.column_id}>
                                        {item.id}
                                    </DataTable.Cell>
                                ) : (
                                    <View></View>
                                )}
                                {showNameColumn ? (
                                    <View style={styles.column_name}>
                                        <WrappedText text={item.full_name} />
                                    </View>
                                ) : (
                                    <View></View>
                                )}
                                {showZoneColumn ? (
                                    <View style={styles.column_zone}>
                                        <WrappedText text={item.zone} />
                                    </View>
                                ) : (
                                    <View></View>
                                )}
                                {showRoleColumn ? (
                                    <DataTable.Cell style={styles.column_role}>
                                        {item.role}
                                    </DataTable.Cell>
                                ) : (
                                    <View></View>
                                )}
                                {showStatusColumn ? (
                                    <DataTable.Cell style={styles.column_status}>
                                        {item.status}
                                    </DataTable.Cell>
                                ) : (
                                    <View></View>
                                )}
                            </DataTable.Row>
                        );
                    })}
                </DataTable>
            </ScrollView>
        </View>
    );
};

export default UserList;
