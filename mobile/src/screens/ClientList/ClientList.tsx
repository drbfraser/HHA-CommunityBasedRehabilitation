import { SearchOption, themeColors, useZones } from "@cbr/common";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import { Picker } from "@react-native-picker/picker";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleProp, StyleSheet, Switch, Text, View, ViewStyle } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import CustomMultiPicker from "react-native-multiple-select-list";
import {
    Checkbox,
    DataTable,
    IconButton,
    Modal,
    Portal,
    Searchbar,
    Text as PaperText,
    TouchableRipple,
} from "react-native-paper";
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

const isSameList = (a: ClientListRow[], b: ClientListRow[]) =>
    a.length === b.length && a.every((row, index) => isSameRow(row, b[index]));

/*
    Row and cell styles copied from react-native-paper's DataTable.Row and DataTable.Cell (for the
    app's MD2 theme) and from WrappedText. Rows are built from these directly because the Paper
    components cost ~40 ms per row on low-end phones (every DataTable.Cell is its own
    TouchableRipple, and WrappedText creates its styles on every render), which made scrolling
    show blank rows.
*/
const rowStyles = StyleSheet.create({
    row: {
        borderStyle: "solid",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "rgba(0, 0, 0, 0.12)",
        minHeight: 48,
        paddingHorizontal: 16,
    },
    rowContent: {
        flex: 1,
        flexDirection: "row",
    },
    cell: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    wrappedView: {
        flexDirection: "row",
        flex: 1.5,
        alignItems: "center",
        padding: 5,
    },
    activeText: {
        flexShrink: 1,
    },
    archivedText: {
        flexShrink: 1,
        color: "grey",
    },
});

const RowText = ({ text, isActive }: { text: string; isActive?: boolean }) => (
    <View style={rowStyles.wrappedView}>
        <PaperText
            style={
                isActive === undefined || isActive ? rowStyles.activeText : rowStyles.archivedText
            }
        >
            {text}
        </PaperText>
    </View>
);

const RiskCell = ({ levelColor }: { levelColor: string }) => (
    <View style={[rowStyles.cell, styles.columnIcons]}>{renderRiskIcon(levelColor)}</View>
);

// Memoized so reloading the list only re-renders rows whose data changed.
const ClientRow = React.memo(
    ({ item, columns, onPress }: ClientRowProps) => (
        <TouchableRipple style={[rowStyles.row, styles.item]} onPress={() => onPress(item.id)}>
            <View style={rowStyles.rowContent}>
                {columns.name ? (
                    <View style={styles.column_name}>
                        <RowText text={item.full_name} isActive={item.is_active} />
                    </View>
                ) : (
                    <View></View>
                )}

                {columns.zone ? (
                    <View style={styles.column_zone}>
                        <RowText text={item.zone} isActive={item.is_active} />
                    </View>
                ) : (
                    <View></View>
                )}

                {columns.health ? <RiskCell levelColor={item.HealthLevel} /> : <View></View>}
                {columns.education ? <RiskCell levelColor={item.EducationLevel} /> : <View></View>}
                {columns.social ? <RiskCell levelColor={item.SocialLevel} /> : <View></View>}
                {columns.nutrition ? <RiskCell levelColor={item.NutritionLevel} /> : <View></View>}
                {columns.mental ? <RiskCell levelColor={item.MentalLevel} /> : <View></View>}
            </View>
        </TouchableRipple>
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

    const clientListRef = useRef<ClientListRow[]>([]);

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
        // Reloading on every focus usually returns the same rows. Keeping the current list then
        // avoids making the FlatList re-render all of its built rows (slow on low-end phones).
        if (isSameList(clientListRef.current, exampleClient)) {
            return;
        }
        clientListRef.current = exampleClient;
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
                // Keep rows built for ~2 screens above and below, not the default ~10: each row is
                // expensive on low-end phones, and filling a large window after scrolling kept
                // the JS thread busy for many seconds, even after opening a client.
                windowSize={5}
                // Android restores focus to the search field when returning from a client. With
                // the default ("never"), the first tap on a row then only unfocused the field.
                keyboardShouldPersistTaps="handled"
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
