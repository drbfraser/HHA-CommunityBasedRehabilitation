import React, { useEffect } from "react";
import { Text, View, Switch, StyleProp, ViewStyle } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Modal, DataTable, IconButton, Portal } from "react-native-paper";
import useStyles from "./ClientList.styles";
import { ClientListRow, fetchClientsFromDB } from "./ClientListRequest";
import { riskTypes } from "../../util/riskIcon";
import { useState } from "react";
import { Searchbar } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { SearchOption, themeColors, useZones } from "@cbr/common";
const styles = useStyles();
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { StackScreenName } from "../../util/StackScreenName";
import { AppStackNavProp } from "../../util/stackScreens";
import {
    SortOptions,
    sortBy,
    arrowDirectionController,
    clientComparator,
    TSortDirection,
} from "../../util/listFunctions";
import { WrappedText } from "../../components/WrappedText/WrappedText";
import CustomMultiPicker from "react-native-multiple-select-list";
import { useDatabase } from "@nozbe/watermelondb/hooks";

const ClientList = () => {
    const navigation = useNavigation<AppStackNavProp>();
    const [clientList, setClientList] = useState<ClientListRow[]>([]);
    const [selectedSearchOption, setSearchOption] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [allClientsMode, setAllClientsMode] = useState<boolean>(true);
    const [sortDirection, setIsSortDirection] = useState<TSortDirection>("None");
    const [sortOption, setSortOption] = useState("");
    const zones = useZones();
    const onChangeSearch = (query: React.SetStateAction<string>) => setSearchQuery(query);
    const isFocused = useIsFocused();
    const database = useDatabase();

    const [showColumnBuilderMenu, setShowColumnBuilderMenu] = useState(false);

    const [showIDColumn, setShowIDColumn] = useState(true);
    const [showNameColumn, setShowNameColumn] = useState(true);
    const [showZoneColumn, setShowZoneColumn] = useState(true);
    const [showHealthColumn, setShowHealthColumn] = useState(true);
    const [showEducationColumn, setShowEducationColumn] = useState(true);
    const [showSocialColumn, setShowSocialColumn] = useState(true);
    const [selectedColumn, setSelectedColumn] = useState<String[]>(["0", "1", "2", "3", "4", "5"]);
    const columnShowingList = [
        setShowIDColumn,
        setShowNameColumn,
        setShowZoneColumn,
        setShowHealthColumn,
        setShowEducationColumn,
        setShowSocialColumn,
    ];

    const openColumnBuilderMenu = () => {
        setShowColumnBuilderMenu(true);
        showSelectedColumn;
    };
    const closeColumnBuilderMenu = () => {
        setShowColumnBuilderMenu(false);
        showSelectedColumn;
    };

    const columnList = { 0: "ID", 1: "Name", 2: "Zone", 3: "Health", 4: "Education", 5: "Social" };

    const clientSortBy = (option: string) => {
        sortBy(option, sortOption, sortDirection, setSortOption, setIsSortDirection);
    };

    const clientListScreenComparator = (a: ClientListRow, b: ClientListRow) => {
        return clientComparator(a, b, sortOption, sortDirection);
    };

    const newClientGet = async () => {
        var exampleClient = await fetchClientsFromDB(
            selectedSearchOption,
            searchQuery,
            allClientsMode,
            database
        );
        if (sortDirection !== "None") {
            exampleClient = exampleClient.sort(clientListScreenComparator);
        }
        setClientList(exampleClient);
    };

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
                    onPress={() => clientSortBy(props.thisColumnSortOption)}
                    sortDirection={arrowDirectionController(
                        props.thisColumnSortOption,
                        sortOption,
                        sortDirection
                    )}
                >
                    {props.label}
                </DataTable.Title>
            );
        } else {
            return <View></View>;
        }
    };

    const showSelectedColumn = () => {
        columnShowingList.forEach((element, index) => {
            element(selectedColumn.includes(String(index)));
        });
    };

    useEffect(() => {
        if (isFocused) {
            newClientGet();
        }
    }, [selectedSearchOption, searchQuery, allClientsMode, sortOption, sortDirection, isFocused]);

    useEffect(() => {
        showSelectedColumn();
    }, [selectedColumn]);
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
            <View style={styles.row}>
                <Text style={{ flex: 0.7, paddingRight: 10, margin: 10 }}>My Clients</Text>
                <Switch
                    style={styles.switch}
                    trackColor={{ false: themeColors.white, true: themeColors.yellow }}
                    thumbColor={allClientsMode ? themeColors.white : themeColors.white}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={setAllClientsMode}
                    value={allClientsMode}
                />
                <Text style={styles.container}>All Clients</Text>

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
                            label={riskTypes.HEALTH.Icon(themeColors.riskBlack)}
                            style={styles.columnIcons}
                            showTheTitle={showHealthColumn}
                            thisColumnSortOption={SortOptions.HEALTH}
                        />
                        <ShowTitle
                            label={riskTypes.EDUCAT.Icon(themeColors.riskBlack)}
                            style={styles.columnIcons}
                            showTheTitle={showEducationColumn}
                            thisColumnSortOption={SortOptions.EDUCATION}
                        />
                        <ShowTitle
                            label={riskTypes.SOCIAL.Icon(themeColors.riskBlack)}
                            style={styles.columnIcons}
                            showTheTitle={showSocialColumn}
                            thisColumnSortOption={SortOptions.SOCIAL}
                        />
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

                                {showHealthColumn ? (
                                    <DataTable.Cell style={styles.columnIcons}>
                                        {riskTypes.CIRCLE.Icon(item.HealthLevel)}
                                    </DataTable.Cell>
                                ) : (
                                    <View></View>
                                )}
                                {showEducationColumn ? (
                                    <DataTable.Cell style={styles.columnIcons}>
                                        {riskTypes.CIRCLE.Icon(item.EducationLevel)}
                                    </DataTable.Cell>
                                ) : (
                                    <View></View>
                                )}
                                {showSocialColumn ? (
                                    <DataTable.Cell style={styles.columnIcons}>
                                        {riskTypes.CIRCLE.Icon(item.SocialLevel)}
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
export default ClientList;
