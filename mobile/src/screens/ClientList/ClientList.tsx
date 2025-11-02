import { SearchOption, themeColors, useZones } from "@cbr/common";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import { Picker } from "@react-native-picker/picker";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleProp, Switch, Text, View, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
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
import useStyles from "./ClientList.styles";
import { ClientListRow, fetchClientsFromDB } from "./ClientListRequest";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
const styles = useStyles();

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

    const renderRiskIcon = (levelColor) => {
        if (levelColor !== themeColors.noRiskGrey) return riskTypes.CIRCLE.Icon(levelColor);
        return riskTypes.CIRCLE_OUTLINE.Icon(levelColor);
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
            <ScrollView>
                <DataTable>
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
                                        {renderRiskIcon(item.HealthLevel)}
                                    </DataTable.Cell>
                                ) : (
                                    <View></View>
                                )}
                                {showEducationColumn ? (
                                    <DataTable.Cell style={styles.columnIcons}>
                                        {renderRiskIcon(item.EducationLevel)}
                                    </DataTable.Cell>
                                ) : (
                                    <View></View>
                                )}
                                {showSocialColumn ? (
                                    <DataTable.Cell style={styles.columnIcons}>
                                        {renderRiskIcon(item.SocialLevel)}
                                    </DataTable.Cell>
                                ) : (
                                    <View></View>
                                )}
                                {showNutritionColumn ? (
                                    <DataTable.Cell style={styles.columnIcons}>
                                        {renderRiskIcon(item.NutritionLevel)}
                                    </DataTable.Cell>
                                ) : (
                                    <View></View>
                                )}
                                {ShowMentalColumn ? (
                                    <DataTable.Cell style={styles.columnIcons}>
                                        {renderRiskIcon(item.MentalLevel)}
                                    </DataTable.Cell>
                                ) : (
                                    <View></View>
                                )}
                            </DataTable.Row>
                        );
                    })}
                </DataTable>
            </ScrollView>
        </SafeAreaView>
    );
};
export default ClientList;
