import React, { useContext, useEffect, useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { Text, IconButton, Portal, Modal, Button } from "react-native-paper";
import useStyles from "./UserList.styles";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import { AppStackNavProp } from "../../util/stackScreens";
import { useNavigation } from "@react-navigation/core";
import { SearchOption, themeColors, useCurrentUser, useZones } from "@cbr/common";
import { StackScreenName } from "../../util/StackScreenName";
import { Picker } from "@react-native-picker/picker";
import { Searchbar } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { DataTable } from "react-native-paper";
import BriefUser, { fetchUsersFromDB } from "./UserListRequest";
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
import { useDatabase } from "@nozbe/watermelondb/hooks";
import { SyncContext } from "../../context/SyncContext/SyncContext";
import { checkUnsyncedChanges } from "../../util/syncHandler";
import { Icon } from "react-native-elements";
import LanguagePicker from "../../components/LanguagePicker/LanguagePicker";
import { useTranslation } from "react-i18next";

const UserList = () => {
    const styles = useStyles();
    const authContext = useContext(AuthContext);
    const navigation = useNavigation<AppStackNavProp>();
    const zones = useZones();
    const database = useDatabase();
    const currentUser = useCurrentUser();
    const [userList, setUserList] = useState<BriefUser[]>([]);
    const [selectedSearchOption, setSearchOption] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const onChangeSearch = (query: React.SetStateAction<string>) => setSearchQuery(query);
    const [sortOption, setSortOption] = useState("");
    const [sortDirection, setIsSortDirection] = useState<TSortDirection>("None");
    const [isAuthenticate, setAuthenticate] = useState<boolean>(false);
    const { setUnSyncedChanges } = useContext(SyncContext);
    const { t } = useTranslation();

    const [showColumnBuilderMenu, setShowColumnBuilderMenu] = useState(false);

    const [showNameColumn, setShowNameColumn] = useState(true);
    const [showZoneColumn, setShowZoneColumn] = useState(true);
    const [showRoleColumn, setShowRoleColumn] = useState(true);
    const [showStatusColumn, setShowStatusColumn] = useState(true);

    const [selectedColumn, setSelectedColumn] = useState<String[]>(["0", "1", "2", "3"]);
    const columnShowingList = [
        setShowNameColumn,
        setShowZoneColumn,
        setShowRoleColumn,
        setShowStatusColumn,
    ];
    const columnList = {
        0: t("admin.name"),
        1: t("admin.zone"),
        2: t("admin.role"),
        3: t("admin.status"),
    };
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
        var fetchedUserList = await fetchUsersFromDB(
            selectedSearchOption,
            searchQuery,
            sortOption,
            sortDirection,
            database
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
            checkUnsyncedChanges().then((res) => {
                setUnSyncedChanges(res);
            });
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
                <LanguagePicker />
            </View>
            <View style={styles.row}>
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
                        placeholder={t("admin.searchPlaceholder")}
                        onChangeText={onChangeSearch}
                        value={searchQuery}
                    />
                )}
            </View>

            <View style={styles.row}>
                <Text style={styles.title}>{t("admin.searchBy")}</Text>
                <Picker
                    style={styles.select}
                    selectedValue={selectedSearchOption}
                    onValueChange={(itemValue, itemIndex) => {
                        setSearchOption(itemValue);
                        setSearchQuery("");
                    }}
                >
                    <Picker.Item label={t("admin.notApplicable")} value="" />
                    <Picker.Item label={t("admin.name")} value={SearchOption.NAME} />
                    <Picker.Item label={t("admin.zone")} value={SearchOption.ZONE} />
                </Picker>
                <IconButton
                    icon="dots-vertical"
                    iconColor={themeColors.borderGray}
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
                            placeholder={t("admin.selectAColumn")}
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
                        <DataTable.Title style={styles.column_icon}>{""}</DataTable.Title>
                        <ShowTitle
                            label={t("admin.name")}
                            style={styles.column_name}
                            showTheTitle={showNameColumn}
                            thisColumnSortOption={SortOptions.NAME}
                        />
                        <ShowTitle
                            label={t("admin.zone")}
                            style={styles.column_zone}
                            showTheTitle={showZoneColumn}
                            thisColumnSortOption={SortOptions.ZONE}
                        />
                        <ShowTitle
                            label={t("admin.role")}
                            style={styles.column_role}
                            showTheTitle={showRoleColumn}
                            thisColumnSortOption={SortOptions.ROLE}
                        />
                        <ShowTitle
                            label={t("admin.status")}
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
                                        userID: item.id,
                                    });
                                }}
                            >
                                <View style={styles.column_icon}>
                                    {item.id == currentUser!.id ? (
                                        <Icon type="font-awesome-5" name="user-circle" />
                                    ) : (
                                        <></>
                                    )}
                                </View>
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
