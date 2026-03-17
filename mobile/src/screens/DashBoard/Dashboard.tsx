import React, { useContext, useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import * as Localization from "expo-localization";
import { ActivityIndicator, Card, DataTable } from "react-native-paper";
import useStyles from "./Dashboard.styles";
import { BriefReferral, fetchAllClientsFromDB, fetchReferrals } from "./DashboardRequest";
import { riskTypes } from "../../util/riskIcon";
import { ScrollView } from "react-native-gesture-handler";
import { APILoadError, getCurrentUser, IUser, themeColors, timestampToDate } from "@cbr/common";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SyncSettings } from "../Sync/PrefConstants";
import { useSyncStatus } from "../../util/useSyncStatus";
import {
    notifyAutoSyncFailure,
    notifyDashboardSyncComplete,
    notifyStaleSyncWarning,
} from "../../util/syncNotifications";
import { useNetInfo } from "@react-native-community/netinfo";

const Dashboard = () => {
    const styles = useStyles();
    const [clientSortOption, setClientSortOption] = useState("");
    const [clientSortDirection, setClientIsSortDirection] = useState<TSortDirection>("None");

    const [referralSortOption, setReferralSortOption] = useState("");
    const [referralSortDirection, setReferralIsSortDirection] = useState<TSortDirection>("None");
    const [unreadAlertsCount, setUnreadAlertsCount] = useState<number>(0);
    const [userId, setUserId] = useState<string>("unknown");
    const [lastSyncTimestamp, setLastSyncTimestamp] = useState<number | null>(null);
    const [hasCompletedFirstSync, setHasCompletedFirstSync] = useState<boolean>(false);
    const [syncStatsLoaded, setSyncStatsLoaded] = useState<boolean>(false);
    const [allowDashboardFallback, setAllowDashboardFallback] = useState<boolean>(false);

    const isFocused = useIsFocused();
    const netInfo = useNetInfo();
    const database = useDatabase();
    const { setUnSyncedChanges, screenRefresh } = useContext(SyncContext);

    const { t } = useTranslation();
    const { status: syncStatus } = useSyncStatus();
    const previousSyncPhase = useRef(syncStatus.phase);
    const previousDashboardLoading = useRef<boolean>(true);
    const hasShownDashboardLoadedToast = useRef<boolean>(false);
    const hasShownStaleSyncToastForFocus = useRef<boolean>(false);
    const hasShownSyncFallbackToast = useRef<boolean>(false);

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

    const renderRiskIcon = (levelColor) => {
        if (levelColor !== themeColors.noRiskGrey) return riskTypes.CIRCLE.Icon(levelColor);
        return riskTypes.CIRCLE_OUTLINE.Icon(levelColor);
    };

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

    const getUserProfile = async (): Promise<string | null> => {
        let user: IUser | typeof APILoadError = await getCurrentUser();
        if (user !== APILoadError) {
            setUserId(user.id);
            return user.id;
        }
        return null;
    };

    const countUnreadAlerts = async (forUserId?: string) => {
        const currentUserId = forUserId ?? userId;
        if (!currentUserId || currentUserId === "unknown") {
            setUnreadAlertsCount(0);
            return;
        }

        const fetchedAlerts: any = await database.get(modelName.alert).query().fetch();

        setUnreadAlertsCount(
            fetchedAlerts.filter((alert) => {
                return alert.unread_by_users.includes(currentUserId);
            }).length
        );
    };

    const refreshDashboardData = async () => {
        const currentUserId = await getUserProfile();
        await countUnreadAlerts(currentUserId ?? undefined);
        await Promise.all([getNewClient(), getReferrals()]);
        const hasUnsyncedChanges = await checkUnsyncedChanges();
        setUnSyncedChanges(hasUnsyncedChanges);
    };

    const loadLastSyncTimestamp = async () => {
        try {
            const storedSyncStats = await AsyncStorage.getItem(SyncSettings.SyncStats);
            if (!storedSyncStats) {
                setLastSyncTimestamp(null);
                setHasCompletedFirstSync(false);
                return;
            }

            const parsedStats = JSON.parse(storedSyncStats);
            const parsedTimestamp = Number(parsedStats?.lastPulledTime ?? 0);
            const hasSynced = Number.isFinite(parsedTimestamp) && parsedTimestamp > 0;

            setLastSyncTimestamp(hasSynced ? parsedTimestamp : null);
            setHasCompletedFirstSync(hasSynced);
        } catch (e) {
            setLastSyncTimestamp(null);
            setHasCompletedFirstSync(false);
        } finally {
            setSyncStatsLoaded(true);
        }
    };

    useEffect(() => {
        if (isFocused && screenRefresh) {
            refreshDashboardData();
            loadLastSyncTimestamp();
        }
    }, [
        clientSortOption,
        referralSortOption,
        clientSortDirection,
        referralSortDirection,
        isFocused,
        screenRefresh,
    ]);

    useEffect(() => {
        loadLastSyncTimestamp();
    }, []);

    useEffect(() => {
        if (
            previousSyncPhase.current !== syncStatus.phase &&
            syncStatus.phase === "success" &&
            isFocused
        ) {
            loadLastSyncTimestamp();
            refreshDashboardData();
        }
        previousSyncPhase.current = syncStatus.phase;
    }, [syncStatus.phase, isFocused]);

    const locale = Localization.locale;
    const timezone = Localization.timezone; // todo: resolve deprecated
    const showFirstSyncInProgress =
        (!syncStatsLoaded || !hasCompletedFirstSync) && !allowDashboardFallback;
    const showOfflineFallbackWarning = allowDashboardFallback && !hasCompletedFirstSync;
    const hoursSinceLastSync =
        lastSyncTimestamp !== null
            ? Math.floor((Date.now() - lastSyncTimestamp) / (1000 * 60 * 60))
            : null;
    const showStaleSyncWarning = hoursSinceLastSync !== null && hoursSinceLastSync >= 24;

    useEffect(() => {
        if (hasCompletedFirstSync) {
            setAllowDashboardFallback(false);
            hasShownSyncFallbackToast.current = false;
            return;
        }

        if (!isFocused || !syncStatsLoaded || allowDashboardFallback) return;

        if (netInfo.isInternetReachable === false) {
            setAllowDashboardFallback(true);
            void refreshDashboardData();
            if (!hasShownSyncFallbackToast.current) {
                notifyAutoSyncFailure("no_internet");
                hasShownSyncFallbackToast.current = true;
            }
            return;
        }

        const fallbackTimer = setTimeout(() => {
            setAllowDashboardFallback(true);
            void refreshDashboardData();
            if (!hasShownSyncFallbackToast.current) {
                notifyAutoSyncFailure();
                hasShownSyncFallbackToast.current = true;
            }
        }, 15000);

        return () => clearTimeout(fallbackTimer);
    }, [
        isFocused,
        syncStatsLoaded,
        hasCompletedFirstSync,
        allowDashboardFallback,
        netInfo.isInternetReachable,
    ]);

    useEffect(() => {
        if (!isFocused) return;

        if (
            previousDashboardLoading.current &&
            !showFirstSyncInProgress &&
            hasCompletedFirstSync &&
            !hasShownDashboardLoadedToast.current
        ) {
            notifyDashboardSyncComplete();
            hasShownDashboardLoadedToast.current = true;
        }

        previousDashboardLoading.current = showFirstSyncInProgress;
    }, [showFirstSyncInProgress, isFocused]);

    useEffect(() => {
        if (!isFocused) {
            hasShownStaleSyncToastForFocus.current = false;
            return;
        }

        if (
            !showFirstSyncInProgress &&
            showStaleSyncWarning &&
            hoursSinceLastSync !== null &&
            !hasShownStaleSyncToastForFocus.current
        ) {
            notifyStaleSyncWarning(hoursSinceLastSync);
            hasShownStaleSyncToastForFocus.current = true;
        }
    }, [isFocused, showFirstSyncInProgress, showStaleSyncWarning, hoursSinceLastSync]);

    return (
        <SafeAreaView style={styles.container}>
            <ConflictDialog />
            {showFirstSyncInProgress ? (
                <View style={styles.sync_overlay}>
                    <View style={styles.sync_in_progress_container}>
                        <ActivityIndicator
                            animating={true}
                            size="large"
                            style={styles.sync_in_progress_spinner}
                        />
                        <Text style={styles.sync_in_progress_text}>
                            {t("dashboard.syncInProgress", {
                                defaultValue: "Synchronizing with server",
                            })}
                        </Text>
                    </View>
                </View>
            ) : (
                <ScrollView>
                    <View style={styles.row}>
                        <Text style={styles.title}>{t("general.dashboard")}</Text>
                    </View>
                    <View>
                        {unreadAlertsCount > 0 ? (
                            <Alert
                                style={styles.inbox_info_alert}
                                severity={"info"}
                                text={t("alert.messageAlert", { numMessages: unreadAlertsCount })}
                            />
                        ) : (
                            <></>
                        )}
                    </View>
                    <View>
                        {showOfflineFallbackWarning ? (
                            <Alert
                                style={styles.offline_fallback_alert}
                                severity={"error"}
                                text={t("dashboard.noSyncedDataWarning", {
                                    defaultValue:
                                        "Unable to synchronize right now. Showing locally stored data only. Please connect to the internet and synchronize.",
                                })}
                            />
                        ) : null}
                    </View>
                    <View>
                        {showStaleSyncWarning ? (
                            <Alert
                                style={styles.stale_sync_warning_alert}
                                severity={"error"}
                                text={t("dashboard.syncStaleWarning", {
                                    defaultValue:
                                        "Warning: It's been at least {{hours}} hours since data was synchronized with the server. Please connect to the internet and synchronize soon.",
                                    hours: hoursSinceLastSync,
                                })}
                            />
                        ) : null}
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
                                            sortDirection={clientArrowDirectionController(
                                                "education"
                                            )}
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
                                            sortDirection={clientArrowDirectionController(
                                                "nutrition"
                                            )}
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
                                                    {renderRiskIcon(item.HealthLevel)}
                                                </DataTable.Cell>
                                                <DataTable.Cell style={styles.column_client_icon}>
                                                    {renderRiskIcon(item.EducationLevel)}
                                                </DataTable.Cell>
                                                <DataTable.Cell style={styles.column_client_icon}>
                                                    {renderRiskIcon(item.SocialLevel)}
                                                </DataTable.Cell>
                                                <DataTable.Cell style={styles.column_client_icon}>
                                                    {renderRiskIcon(item.NutritionLevel)}
                                                </DataTable.Cell>
                                                <DataTable.Cell style={styles.column_client_icon}>
                                                    {renderRiskIcon(item.MentalLevel)}
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
                                    {clientList.length === 0 ? (
                                        <DataTable.Row style={styles.item}>
                                            <View style={styles.empty_state_row}>
                                                <Text style={styles.empty_state_text}>
                                                    {showOfflineFallbackWarning
                                                        ? t("dashboard.noSyncedDataYet", {
                                                              defaultValue:
                                                                  "No synchronized dashboard data is available yet on this device.",
                                                          })
                                                        : t("dashboard.noPriorityClients", {
                                                              defaultValue:
                                                                  "No Priority Clients Found",
                                                          })}
                                                </Text>
                                            </View>
                                        </DataTable.Row>
                                    ) : null}
                                </DataTable>
                            </ScrollView>
                        </Card>
                    </View>
                    <View>
                        <Card>
                            <Card.Title
                                title={t("dashboard.clientListOutstandingRefs")}
                            ></Card.Title>
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
                                    {referralList.length === 0 ? (
                                        <DataTable.Row style={styles.item}>
                                            <View style={styles.empty_state_row}>
                                                <Text style={styles.empty_state_text}>
                                                    {showOfflineFallbackWarning
                                                        ? t("dashboard.noSyncedDataYet", {
                                                              defaultValue:
                                                                  "No synchronized dashboard data is available yet on this device.",
                                                          })
                                                        : t("dashboard.noOutstandingReferrals", {
                                                              defaultValue:
                                                                  "No Outstanding Referrals Found",
                                                          })}
                                                </Text>
                                            </View>
                                        </DataTable.Row>
                                    ) : null}
                                </DataTable>
                            </ScrollView>
                        </Card>
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
};
export default Dashboard;
