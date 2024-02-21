import React, { useContext, useEffect } from "react";
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
import { SyncContext } from "../../context/SyncContext/SyncContext";
import { checkUnsyncedChanges } from "../../util/syncHandler";
import { Checkbox } from "react-native-paper";
import { useTranslation } from "react-i18next";


const ClientList = () => {
    const navigation = useNavigation<AppStackNavProp>();
    const [clientList, setClientList] = useState<ClientListRow[]>([]);
    const [selectedSearchOption, setSearchOption] = useState(SearchOption.NAME);
    const [searchQuery, setSearchQuery] = useState("");
    const [allClientsMode, setAllClientsMode] = useState<boolean>(true);
    const [archivedMode, setArchivedMode] = useState<boolean>(false);
    const [sortDirection, setIsSortDirection] = useState<TSortDirection>("None");
    const [sortOption, setSortOption] = useState("");
    const zones = useZones();
    const onChangeSearch = (query: React.SetStateAction<string>) => setSearchQuery(query);
    const isFocused = useIsFocused();
    const database = useDatabase();
    const { setUnSyncedChanges } = useContext(SyncContext);
    const { t } = useTranslation();

    const [showColumnBuilderMenu, setShowColumnBuilderMenu] = useState(false);

    const [showNameColumn, setShowNameColumn] = useState(true);
    const [showZoneColumn, setShowZoneColumn] = useState(true);
    const [showHealthColumn, setShowHealthColumn] = useState(true);
    const [showEducationColumn, setShowEducationColumn] = useState(true);
    const [showSocialColumn, setShowSocialColumn] = useState(true);
    const [showNutritionColumn, setShowNutritionColumn] = useState(true);
    const [ShowMentalColumn, setShowMentalColumn] = useState(true);
    const [selectedColumn, setSelectedColumn] = useState<String[]>([
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
    ]);
    const columnShowingList = [
        setShowNameColumn,
        setShowZoneColumn,
        setShowHealthColumn,
        setShowEducationColumn,
        setShowSocialColumn,
        setShowNutritionColumn,
        setShowMentalColumn,
    ];

    const openColumnBuilderMenu = () => {
        setShowColumnBuilderMenu(true);
        showSelectedColumn;
    };
    const closeColumnBuilderMenu = () => {
        setShowColumnBuilderMenu(false);
        showSelectedColumn;
    };

    const columnList = {
        0: t("commons.name"),
        1: t("commons.zone"),
        2: t("commons.health"),
        3: t("commons.education"),
        4: t("commons.social"),
        5: t("commons.nutrition"),
        6: t("commons.mentalHealth"),
    };

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
            archivedMode,
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
            checkUnsyncedChanges().then((res) => {
                setUnSyncedChanges(res);
            });
        }
    }, [
        selectedSearchOption,
        searchQuery,
        allClientsMode,
        sortOption,
        sortDirection,
        isFocused,
        archivedMode,
    ]);

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
                        placeholder={t("commons.search")}
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
                            placeholder={t("commons.selectObject", {object: "commons.columns"})}
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
                <Text style={{ flex: 0.7, margin: 10 }}>{t("dashboard.myClients")}</Text>
                <Switch
                    style={styles.switch}
                    trackColor={{ false: themeColors.white, true: themeColors.yellow }}
                    thumbColor={allClientsMode ? themeColors.white : themeColors.white}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={setAllClientsMode}
                    value={allClientsMode}
                />
                <Text style={styles.container}>{t("dashboard.allClients")}</Text>

                <Text style={{ textAlign: "center", fontSize: 16 }}>{t("commons.filterBy")}</Text>
                <Picker
                    style={styles.select}
                    selectedValue={selectedSearchOption}
                    onValueChange={(itemValue, itemIndex) => {
                        setSearchOption(itemValue);
                        setSearchQuery("");
                    }}
                >
                    <Picker.Item label={t("commons.name")} value={SearchOption.NAME} />
                    <Picker.Item label={t("commons.zone")} value={SearchOption.ZONE} />
                </Picker>
            </View>
            <View style={styles.checkbox}>
                <Text style={{ alignSelf: "center" }}>{t("dashboard.showArchived")}</Text>
                <Checkbox
                    status={archivedMode ? "checked" : "unchecked"}
                    onPress={() => {
                        setArchivedMode(!archivedMode);
                    }}
                />
            </View>
            <ScrollView>
                <DataTable>
                    <DataTable.Header style={styles.item}>
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
                        <ShowTitle
                            label={riskTypes.NUTRIT.Icon(themeColors.riskBlack)}
                            style={styles.columnIcons}
                            showTheTitle={showNutritionColumn}
                            thisColumnSortOption={SortOptions.NUTRITION}
                        />
                        <ShowTitle
                            label={riskTypes.MENTAL.Icon(themeColors.riskBlack)}
                            style={styles.columnIcons}
                            showTheTitle={ShowMentalColumn}
                            thisColumnSortOption={SortOptions.MENTAL}
                        />
                    </DataTable.Header>
                    {clientList.map((item: ClientListRow) => {
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
                                {showNameColumn ? (
                                    <View style={styles.column_name}>
                                        <WrappedText
                                            text={item.full_name}
                                            is_active={item.is_active}
                                        />
                                    </View>
                                ) : (
                                    <View></View>
                                )}

                                {showZoneColumn ? (
                                    <View style={styles.column_zone}>
                                        <WrappedText text={item.zone} is_active={item.is_active} />
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
                                {showNutritionColumn ? (
                                    <DataTable.Cell style={styles.columnIcons}>
                                        {riskTypes.CIRCLE.Icon(item.NutritionLevel)}
                                    </DataTable.Cell>
                                ) : (
                                    <View></View>
                                )}
                                {ShowMentalColumn ? (
                                    <DataTable.Cell style={styles.columnIcons}>
                                        {riskTypes.CIRCLE.Icon(item.MentalLevel)}
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
