import { SearchOption, themeColors, useZones } from "@cbr/common";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import { Picker } from "@react-native-picker/picker";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleProp, Switch, Text, View, ViewStyle } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import CustomMultiPicker from "react-native-multiple-select-list";
import { Checkbox, DataTable, IconButton, Modal, Portal, Searchbar } from "react-native-paper";
import { WrappedText } from "../../components/WrappedText/WrappedText";
import { SyncContext } from "../../context/SyncContext/SyncContext";
import {
    arrowDirectionController,
    clientComparator,
    sortBy,
    SortOptions,
    TSortDirection,
} from "../../util/listFunctions";
import { riskTypes } from "../../util/riskIcon";
import { StackScreenName } from "../../util/StackScreenName";
import { AppStackNavProp } from "../../util/stackScreens";
import { checkUnsyncedChanges } from "../../util/syncHandler";
import { logPerf, RenderTiming, useLogRenderTiming } from "../../util/perfTiming";
import useStyles from "./ClientList.styles";
import { ClientListRow, fetchClientsFromDB } from "./ClientListRequest";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
const styles = useStyles();

const renderRiskIcon = (levelColor: string) => {
    if (levelColor !== themeColors.noRiskGrey) return riskTypes.CIRCLE.Icon(levelColor);
    return riskTypes.CIRCLE_OUTLINE.Icon(levelColor);
};

type ColumnVisibility = {
    name: boolean;
    zone: boolean;
    health: boolean;
    education: boolean;
    social: boolean;
    nutrition: boolean;
    mental: boolean;
};

interface ClientRowProps {
    item: ClientListRow;
    columns: ColumnVisibility;
    onPress: (clientID: string) => void;
}

const isSameRow = (a: ClientListRow, b: ClientListRow) =>
    (Object.keys(a) as (keyof ClientListRow)[]).every((key) => a[key] === b[key]);

// Memoized so reloading the list only re-renders rows whose data changed.
const ClientRow = React.memo(
    ({ item, columns, onPress }: ClientRowProps) => (
        <DataTable.Row style={styles.item} onPress={() => onPress(item.id)}>
            {columns.name ? (
                <View style={styles.column_name}>
                    <WrappedText text={item.full_name} is_active={item.is_active} />
                </View>
            ) : (
                <View></View>
            )}

            {columns.zone ? (
                <View style={styles.column_zone}>
                    <WrappedText text={item.zone} is_active={item.is_active} />
                </View>
            ) : (
                <View></View>
            )}

            {columns.health ? (
                <DataTable.Cell style={styles.columnIcons}>
                    {renderRiskIcon(item.HealthLevel)}
                </DataTable.Cell>
            ) : (
                <View></View>
            )}
            {columns.education ? (
                <DataTable.Cell style={styles.columnIcons}>
                    {renderRiskIcon(item.EducationLevel)}
                </DataTable.Cell>
            ) : (
                <View></View>
            )}
            {columns.social ? (
                <DataTable.Cell style={styles.columnIcons}>
                    {renderRiskIcon(item.SocialLevel)}
                </DataTable.Cell>
            ) : (
                <View></View>
            )}
            {columns.nutrition ? (
                <DataTable.Cell style={styles.columnIcons}>
                    {renderRiskIcon(item.NutritionLevel)}
                </DataTable.Cell>
            ) : (
                <View></View>
            )}
            {columns.mental ? (
                <DataTable.Cell style={styles.columnIcons}>
                    {renderRiskIcon(item.MentalLevel)}
                </DataTable.Cell>
            ) : (
                <View></View>
            )}
        </DataTable.Row>
    ),
    (prev, next) =>
        prev.columns === next.columns &&
        prev.onPress === next.onPress &&
        isSameRow(prev.item, next.item)
);

const ClientList = () => {
    const insets = useSafeAreaInsets();
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
        0: t("general.name"),
        1: t("general.zone"),
        2: t("general.health"),
        3: t("general.education"),
        4: t("general.social"),
        5: t("general.nutrition"),
        6: t("general.mentalHealth"),
    };

    const clientSortBy = (option: string) => {
        sortBy(option, sortOption, sortDirection, setSortOption, setIsSortDirection);
    };

    const clientListScreenComparator = (a: ClientListRow, b: ClientListRow) => {
        return clientComparator(a, b, sortOption, sortDirection);
    };

    const renderTiming = useRef<RenderTiming | null>(null);
    useLogRenderTiming("ClientList", renderTiming, [clientList]);

    const newClientGet = async () => {
        const loadStart = Date.now();
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
        logPerf("ClientList", "fetch", loadStart, `${exampleClient.length} rows`);
        renderTiming.current = { loadStart, renderStart: Date.now() };
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

    const columns = useMemo<ColumnVisibility>(
        () => ({
            name: showNameColumn,
            zone: showZoneColumn,
            health: showHealthColumn,
            education: showEducationColumn,
            social: showSocialColumn,
            nutrition: showNutritionColumn,
            mental: ShowMentalColumn,
        }),
        [
            showNameColumn,
            showZoneColumn,
            showHealthColumn,
            showEducationColumn,
            showSocialColumn,
            showNutritionColumn,
            ShowMentalColumn,
        ]
    );

    const openClient = useCallback(
        (clientID: string) => {
            navigation.navigate(StackScreenName.CLIENT, { clientID });
        },
        [navigation]
    );

    const renderClientRow = useCallback(
        ({ item }: { item: ClientListRow }) => (
            <ClientRow item={item} columns={columns} onPress={openClient} />
        ),
        [columns, openClient]
    );

    useEffect(() => {
        if (isFocused) {
            newClientGet();
            const unsyncedStart = Date.now();
            checkUnsyncedChanges().then((res) => {
                logPerf("ClientList", "unsynced check", unsyncedStart);
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
        <SafeAreaView style={styles.container}>
            <View style={styles.row}>
                <View style={styles.rowItem}>
                    {selectedSearchOption === SearchOption.ZONE ? (
                        <>
                            <Text>{t("zone.zone")}</Text>
                            <Picker
                                style={styles.select}
                                selectedValue={searchQuery}
                                onValueChange={(itemValue, itemIndex) => {
                                    setSearchQuery(itemValue);
                                    if (itemValue === "viewAll") {
                                        setSearchQuery("");
                                    }
                                }}
                            >
                                <Picker.Item label={t("statistics.viewAllZones")} value="viewAll" />
                                {Array.from(zones).map(([id, name]) => (
                                    <Picker.Item key={id} label={name} value={id} />
                                ))}
                            </Picker>
                        </>
                    ) : (
                        <Searchbar
                            style={styles.search}
                            placeholder={t("general.search")}
                            onChangeText={onChangeSearch}
                            value={searchQuery}
                        />
                    )}
                    <IconButton
                        icon="dots-vertical"
                        iconColor={themeColors.borderGray}
                        size={20}
                        onPress={openColumnBuilderMenu}
                    />
                </View>
                <View style={styles.rowItem}>
                    <Portal>
                        <Modal
                            visible={showColumnBuilderMenu}
                            onDismiss={closeColumnBuilderMenu}
                            style={styles.colonBuilderChecklist}
                        >
                            <CustomMultiPicker
                                options={columnList}
                                multiple={true}
                                placeholder={t("general.selectObject", {
                                    object: "general.columns",
                                })}
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
                                labelStyle={styles.textGray} // todosd: text not correctly rendering as gray
                                iconColor={themeColors.textGray}
                            />
                        </Modal>
                    </Portal>
                </View>
                <View style={styles.rowItem}>
                    <Text style={styles.textGray}>{t("dashboard.myClients")}</Text>
                    <Switch
                        trackColor={{ false: themeColors.white, true: themeColors.yellow }}
                        thumbColor={allClientsMode ? themeColors.white : themeColors.white}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={setAllClientsMode}
                        value={allClientsMode}
                    />
                    <Text style={styles.textGray}>{t("dashboard.allClients")}</Text>
                </View>

                <View style={styles.rowItem}>
                    <Text style={styles.textGray}>{t("general.filterBy")}</Text>
                    <Picker
                        style={styles.select}
                        selectedValue={selectedSearchOption}
                        onValueChange={(itemValue, itemIndex) => {
                            setSearchOption(itemValue);
                            setSearchQuery("");
                        }}
                    >
                        <Picker.Item label={t("general.name")} value={SearchOption.NAME} />
                        <Picker.Item label={t("general.zone")} value={SearchOption.ZONE} />
                    </Picker>
                </View>
                <View style={styles.rowItem}>
                    <Text style={styles.textGray}>{t("dashboard.showArchived")}</Text>
                    <Checkbox
                        status={archivedMode ? "checked" : "unchecked"}
                        onPress={() => {
                            setArchivedMode(!archivedMode);
                        }}
                    />
                </View>
            </View>
            <FlatList
                testID="client-list-scroll-view"
                data={clientList}
                keyExtractor={(item) => item.id}
                renderItem={renderClientRow}
                ListHeaderComponent={
                    <DataTable.Header style={styles.item}>
                        <ShowTitle
                            label={t("general.name")}
                            style={styles.column_name}
                            showTheTitle={showNameColumn}
                            thisColumnSortOption={SortOptions.NAME}
                        />
                        <ShowTitle
                            label={t("general.zone")}
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
                }
            />
        </SafeAreaView>
    );
};
export default ClientList;
