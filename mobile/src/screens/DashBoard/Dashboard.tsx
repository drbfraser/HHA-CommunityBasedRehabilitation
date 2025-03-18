import React, { useContext, useEffect } from "react";
import { Text, View, NativeModules } from "react-native";
import * as Localization from "expo-localization";
import { Card, DataTable, Button } from "react-native-paper";
import useStyles from "./Dashboard.styles";
import { BriefReferral, fetchAllClientsFromDB, fetchReferrals } from "./DashboardRequest";
import { riskTypes } from "../../util/riskIcon";
import { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { APILoadError, getCurrentUser, IUser, timestampToDate } from "@cbr/common";
import { SafeAreaView } from "react-native-safe-area-context";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { ClientListRow } from "../ClientList/ClientListRequest";
import {
    arrowDirectionController,
    sortBy,
    SortOptions,
    clientComparator,
    referralComparator,
    TSortDirection,
} from "../../util/listFunctions";
import { WrappedText } from "../../components/WrappedText/WrappedText";
import ConflictDialog from "../../components/ConflictDialog/ConflictDialog";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import { SyncContext } from "../../context/SyncContext/SyncContext";
import { checkUnsyncedChanges } from "../../util/syncHandler";
import Alert from "../../components/Alert/Alert";
import { modelName } from "../../models/constant";
import { useTranslation } from "react-i18next";

const Dashboard = () => {
    const styles = useStyles();
    const [clientSortOption, setClientSortOption] = useState("");
    const [clientSortDirection, setClientIsSortDirection] = useState<TSortDirection>("None");

    const [referralSortOption, setReferralSortOption] = useState("");
    const [referralSortDirection, setReferralIsSortDirection] = useState<TSortDirection>("None");
    const [unreadAlertsCount, setUnreadAlertsCount] = useState<number>(0);
    const [userId, setUserId] = useState<string>("unknown");

    const isFocused = useIsFocused();
    const database = useDatabase();
    const { setUnSyncedChanges, screenRefresh, setScreenRefresh } = useContext(SyncContext);

    const { t } = useTranslation();

    const dashBoardClientComparator = (a: ClientListRow, b: ClientListRow): number => {
        return clientComparator(a, b, clientSortOption, clientSortDirection);
    };
    const clientSortBy = async (option: string) => {
        sortBy(
            option,
            clientSortOption,
            clientSortDirection,
            setClientSortOption,
            setClientIsSortDirection
        );
    };
    const clientArrowDirectionController = (column_name: string) => {
        return arrowDirectionController(column_name, clientSortOption, clientSortDirection);
    };

    const dashBoardReferralComparator = (a: BriefReferral, b: BriefReferral): number => {
        return referralComparator(a, b, referralSortOption, referralSortDirection);
    };

    const referralSortBy = async (option: string) => {
        sortBy(
            option,
            referralSortOption,
            referralSortDirection,
            setReferralSortOption,
            setReferralIsSortDirection
        );
    };
    const referralArrowDirectionController = (column_name: string) => {
        return arrowDirectionController(column_name, referralSortOption, referralSortDirection);
    };

    const [clientList, setClientList] = useState<ClientListRow[]>([]);
    const [referralList, setReferralList] = useState<BriefReferral[]>([]);
    const navigation = useNavigation();
    const getNewClient = async () => {
        var fetchedClientList = await fetchAllClientsFromDB(database);
        if (clientSortDirection !== "None") {
            fetchedClientList = fetchedClientList.sort(dashBoardClientComparator);
        }
        setClientList(fetchedClientList);
    };

    const getReferrals = async () => {
        let fetchedReferrals: BriefReferral[] = await fetchReferrals(database);
        if (referralSortDirection !== "None") {
            fetchedReferrals = fetchedReferrals.sort(dashBoardReferralComparator);
        }
        setReferralList(fetchedReferrals);
    };

    const getUserProfile = async () => {
        let user: IUser | typeof APILoadError = await getCurrentUser();
        if (user !== APILoadError) {
            setUserId(user.id);
        }
    };

    const countUnreadAlerts = async () => {
        const fetchedAlerts: any = await database.get(modelName.alert).query().fetch();

        setUnreadAlertsCount(
            fetchedAlerts.filter((alert) => {
                return alert.unread_by_users.includes(userId);
            }).length
        );
    };

    useEffect(() => {
        getUserProfile().then(() => {
            countUnreadAlerts();
        });
        if (isFocused && screenRefresh) {
            getNewClient();
            getReferrals();
            checkUnsyncedChanges().then((res) => {
                setUnSyncedChanges(res);
            });
        }
    }, [
        clientSortOption,
        referralSortOption,
        clientSortDirection,
        referralSortDirection,
        isFocused,
        screenRefresh,
        userId,
    ]);

    const locale = NativeModules.I18nManager.localeIdentifier;
    const timezone = Localization.timezone; // todo: resolve deprecated

    return (
        <SafeAreaView style={styles.container}>
            <ConflictDialog />
            <ScrollView>
                <View style={styles.row}>
                    <Text style={styles.title}>{t("general.dashboard")}</Text>
                    <Text style={styles.title}> 0.74</Text>
                </View>
                <View>
                    {unreadAlertsCount > 0 ? (
                        <Alert
                            style={styles.inbox_info_alert}
                            severity={"info"}
                            text={t("alert.messageAlert", { count: unreadAlertsCount })}
                        />
                    ) : (
                        <></>
                    )}
                </View>
                <View>
                    <Card>
                        <Card.Title title={t("dashboard.clientListPriority")}></Card.Title>
                        <ScrollView>
                            <DataTable>
                                <DataTable.Header style={styles.item}>
                                    <DataTable.Title
                                        style={styles.column_client_name}
                                        onPress={() => clientSortBy("name")}
                                        sortDirection={clientArrowDirectionController("name")}
                                    >
                                        {t("general.name")}
                                    </DataTable.Title>
                                    <DataTable.Title
                                        style={styles.column_client_zone}
                                        onPress={() => clientSortBy("zone")}
                                        sortDirection={clientArrowDirectionController("zone")}
                                    >
                                        {t("general.zone")}
                                    </DataTable.Title>
                                    <DataTable.Title
                                        style={styles.column_client_icon}
                                        onPress={() => clientSortBy("health")}
                                        sortDirection={clientArrowDirectionController("health")}
                                    >
                                        {riskTypes.HEALTH.Icon("#000000")}
                                    </DataTable.Title>
                                    <DataTable.Title
                                        style={styles.column_client_icon}
                                        onPress={() => clientSortBy("education")}
                                        sortDirection={clientArrowDirectionController("education")}
                                    >
                                        {riskTypes.EDUCAT.Icon("#000000")}
                                    </DataTable.Title>
                                    <DataTable.Title
                                        style={styles.column_client_icon}
                                        onPress={() => clientSortBy("social")}
                                        sortDirection={clientArrowDirectionController("social")}
                                    >
                                        {riskTypes.SOCIAL.Icon("#000000")}
                                    </DataTable.Title>
                                    <DataTable.Title
                                        style={styles.column_client_icon}
                                        onPress={() => clientSortBy("nutrition")}
                                        sortDirection={clientArrowDirectionController("nutrition")}
                                    >
                                        {riskTypes.NUTRIT.Icon("#000000")}
                                    </DataTable.Title>
                                    <DataTable.Title
                                        style={styles.column_client_icon}
                                        onPress={() => clientSortBy("mental")}
                                        sortDirection={clientArrowDirectionController("mental")}
                                    >
                                        {riskTypes.MENTAL.Icon("#000000")}
                                    </DataTable.Title>
                                    <DataTable.Title
                                        style={styles.column_client_Last_visit_date}
                                        onPress={() => clientSortBy("date")}
                                        sortDirection={clientArrowDirectionController("date")}
                                    >
                                        {t("clientAttr.lastVisitDate")}
                                    </DataTable.Title>
                                </DataTable.Header>
                                {clientList.map((item) => {
                                    return (
                                        <DataTable.Row
                                            style={styles.item}
                                            key={item.id}
                                            onPress={() => {
                                                navigation.navigate("ClientDetails", {
                                                    clientID: item.id,
                                                });
                                            }}
                                        >
                                            <View style={styles.column_client_name}>
                                                <WrappedText text={item.full_name} />
                                            </View>
                                            <View style={styles.column_client_zone}>
                                                <WrappedText text={item.zone} />
                                            </View>
                                            <DataTable.Cell style={styles.column_client_icon}>
                                                {riskTypes.CIRCLE.Icon(item.HealthLevel)}
                                            </DataTable.Cell>
                                            <DataTable.Cell style={styles.column_client_icon}>
                                                {riskTypes.CIRCLE.Icon(item.EducationLevel)}
                                            </DataTable.Cell>
                                            <DataTable.Cell style={styles.column_client_icon}>
                                                {riskTypes.CIRCLE.Icon(item.SocialLevel)}
                                            </DataTable.Cell>
                                            <DataTable.Cell style={styles.column_client_icon}>
                                                {riskTypes.CIRCLE.Icon(item.NutritionLevel)}
                                            </DataTable.Cell>
                                            <DataTable.Cell style={styles.column_client_icon}>
                                                {riskTypes.CIRCLE.Icon(item.MentalLevel)}
                                            </DataTable.Cell>
                                            <DataTable.Cell
                                                style={styles.column_client_Last_visit_date}
                                            >
                                                <Text style={styles.fontSize}>
                                                    {Number(item.last_visit_date) !== 0
                                                        ? timestampToDate(
                                                              Number(item.last_visit_date),
                                                              locale,
                                                              timezone
                                                          )
                                                        : t("dashboard.noVisits")}
                                                </Text>
                                            </DataTable.Cell>
                                        </DataTable.Row>
                                    );
                                })}
                            </DataTable>
                        </ScrollView>
                    </Card>
                </View>
                <View>
                    <Card>
                        <Card.Title title={t("dashboard.clientListOutstandingRefs")}></Card.Title>
                        <ScrollView>
                            <DataTable>
                                <DataTable.Header style={styles.item}>
                                    <DataTable.Title
                                        style={styles.column_referral_name}
                                        onPress={() => referralSortBy(SortOptions.NAME)}
                                        sortDirection={referralArrowDirectionController(
                                            SortOptions.NAME
                                        )}
                                    >
                                        {t("general.name")}
                                    </DataTable.Title>
                                    <DataTable.Title
                                        style={styles.column_referral_type}
                                        onPress={() => referralSortBy(SortOptions.TYPE)}
                                        sortDirection={referralArrowDirectionController(
                                            SortOptions.TYPE
                                        )}
                                    >
                                        {t("general.type")}
                                    </DataTable.Title>
                                    <DataTable.Title
                                        style={styles.column_referral_date}
                                        onPress={() => referralSortBy(SortOptions.DATE)}
                                        sortDirection={referralArrowDirectionController(
                                            SortOptions.DATE
                                        )}
                                    >
                                        {t("referralAttr.dateReferred")}
                                    </DataTable.Title>
                                </DataTable.Header>
                                {referralList.map((item) => {
                                    return (
                                        <DataTable.Row
                                            style={styles.item}
                                            key={item.id}
                                            onPress={() => {
                                                navigation.navigate("ClientDetails", {
                                                    clientID: item.client_id,
                                                });
                                            }}
                                        >
                                            <View style={styles.column_referral_name}>
                                                <WrappedText text={item.full_name} />
                                            </View>
                                            <View style={styles.column_referral_type}>
                                                <WrappedText text={item.type} />
                                            </View>
                                            <DataTable.Cell style={styles.column_referral_date}>
                                                <Text style={styles.fontSize}>
                                                    {timestampToDate(
                                                        Number(item.date_referred),
                                                        locale,
                                                        timezone
                                                    )}
                                                </Text>
                                            </DataTable.Cell>
                                        </DataTable.Row>
                                    );
                                })}
                            </DataTable>
                        </ScrollView>
                    </Card>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};
export default Dashboard;
