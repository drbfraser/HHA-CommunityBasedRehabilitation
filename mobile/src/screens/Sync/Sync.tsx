import { themeColors, timestampToDateTime, APIFetchFailError } from "@cbr/common";
import { useDatabase } from "@nozbe/watermelondb/hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useEffect, useState } from "react";
import { Alert, SafeAreaView, View, ScrollView } from "react-native";
import { Button, Divider, Text, Card, Switch } from "react-native-paper";
import SyncAlert from "../../components/SyncAlert/SyncAlert";
import { SyncContext } from "../../context/SyncContext/SyncContext";
import {
    SyncDB,
    logger,
    AutoSyncDB,
    lastVersionSyncedIsCurrentVersion,
} from "../../util/syncHandler";
import { SyncSettings } from "./PrefConstants";
import { useNetInfo } from "@react-native-community/netinfo";
import useStyles from "./Sync.styles";
import { SyncDatabaseTask } from "../../tasks/SyncDatabaseTask";
import SyncUpdateAlert from "../../components/SyncUpdateAlert.tsx/SyncUpdateAlert";
import { useTranslation } from "react-i18next";

export interface ISync {
    lastPulledTime: number;
    remoteChanges: number;
    localChanges: number;
}
export const VERSION_NAME: string = "1.3.0";

const Sync = () => {
    const styles = useStyles();
    const database = useDatabase();
    const [alertMessage, setAlertMessage] = useState<string>();
    const [alertSubtitle, setAlertSubtitle] = useState<string>("");
    const [alertStatus, setAlertStatus] = useState<boolean>();
    const [showSyncModal, setSyncModal] = useState<boolean>(false);
    const [showSyncUpdateModal, setSyncUpdateModal] = useState<boolean>(false);
    const { autoSync, setAutoSync, cellularSync, setCellularSync } = useContext(SyncContext);
    const netInfo = useNetInfo();
    const [loading, setLoading] = useState<boolean>(true);
    const [stats, setStats] = useState<ISync>({
        lastPulledTime: 0,
        remoteChanges: 0,
        localChanges: 0,
    });
    const { t } = useTranslation();

    const resetAlertSubtitleIfVisible = () => {
        if (alertSubtitle !== "") {
            setAlertSubtitle("");
        }
    };

    const resetDatabase = async () => {
        Alert.alert(
                t("general.alert"),
                t("sync.sureResetLocalDB"), [
            { text: t("general.cancel"), style: "cancel" },
            {
                text: t("sync.reset"),
                onPress: async () => {
                    await database.write(async () => {
                        await database.unsafeResetDatabase();
                    });
                    setAlertStatus(true);
                    setAlertMessage(t("sync.databaseReset"));
                    resetAlertSubtitleIfVisible();
                    setSyncModal(true);
                    clearStats();
                },
            },
        ]);
    };

    const updateStats = () => {
        const len = logger.logs.length;
        if (len != 0) {
            let newStats: ISync = {
                lastPulledTime: logger.logs[len - 1].newLastPulledAt,
                remoteChanges: logger.logs[len - 1].remoteChangeCount,
                localChanges: logger.logs[len - 1].localChangeCount,
            };
            setStats(newStats);
        }
    };

    const clearStats = async () => {
        await AsyncStorage.removeItem(SyncSettings.SyncStats);
        let newStats: ISync = {
            lastPulledTime: 0,
            remoteChanges: 0,
            localChanges: 0,
        };
        setStats(newStats);
    };

    const retreiveStats = async () => {
        try {
            const value = await AsyncStorage.getItem(SyncSettings.SyncStats);
            if (value != null) {
                const result = JSON.parse(value);
                let newStats: ISync = {
                    lastPulledTime: result.lastPulledTime,
                    remoteChanges: result.remoteChanges,
                    localChanges: result.localChanges,
                };
                setStats(newStats);
            }
        } catch (e) {}
    };

    const storeAutoSync = async (value: boolean) => {
        try {
            await AsyncStorage.setItem(SyncSettings.AutoSyncPref, value.toString());
        } catch (e) {}
    };
    const storeCellularSync = async (value: boolean) => {
        try {
            await AsyncStorage.setItem(SyncSettings.CellularPref, value.toString());
        } catch (e) {}
    };

    const performSync = async () => {
        await SyncDB(database);

        setAlertStatus(true);
        setAlertMessage(t("sync.syncComplete"));
        resetAlertSubtitleIfVisible();
        setSyncModal(true);
        updateStats();
    };

    const handleSyncError = (e) => {
        setAlertStatus(false);
        setAlertMessage(t("sync.syncFailed"));

        if (e instanceof APIFetchFailError && e.status === 403) {
            setAlertSubtitle(
                t("sync.downloadNewVersion")
            );
        }

        setSyncModal(true);
    };

    const onSyncUpdateModalShutdown = async () => {
        setSyncUpdateModal(false);

        try {
            await resetDatabaseAndSync();
        } catch (e) {}
    };

    const resetDatabaseAndSync = async () => {
        await database.write(async () => {
            await database.unsafeResetDatabase();
        });

        await performSync();
    };

    useEffect(() => {
        if (loading) {
            retreiveStats().then(() => {
                setLoading(false);
            });
        }
    }, [loading]);

    console.log("Sync: stats.lastPulledTime: ", stats.lastPulledTime);
    console.log("Sync: stats.localChanges:   ", stats.localChanges);
    console.log("Sync: stats.remoteChanges:  ", stats.remoteChanges);
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.groupContainer}>
                <Text style={styles.cardSectionTitle}>{t("sync.database")} </Text>
                <View style={styles.btnContainer}>
                    <Button
                        icon="database-sync"
                        mode="contained"
                        labelStyle={styles.syncBtnLabel}
                        style={styles.syncBtbContainer}
                        disabled={
                            !netInfo.isConnected
                                ? true
                                : netInfo.type == "cellular" && !cellularSync
                                ? true
                                : false
                        }
                        onPress={async () => {
                            try {
                                if (!(await lastVersionSyncedIsCurrentVersion())) {
                                    setSyncUpdateModal(true);
                                } else {
                                    await performSync();
                                }
                            } catch (e) {
                                handleSyncError(e);
                            }
                        }}
                    >
                        {t("sync.serverSync")}
                    </Button>
                    <Button
                        icon="lock-reset"
                        mode="contained"
                        labelStyle={styles.resetBtnLabel}
                        style={styles.resetBtbContainer}
                        onPress={resetDatabase}
                    >
                        {t("sync.clearLocal")}
                    </Button>
                </View>
                <Divider />
                <Text style={styles.cardSectionTitle}>{t("sync.syncStatistics")}</Text>
                <Card style={styles.CardStyle}>
                    {!loading ? (
                        <>
                            <View style={styles.row}>
                                <Text style={styles.stats}> {t("sync.lastPullAt")}</Text>
                                {stats.lastPulledTime != 0 ? (
                                    <Text>{timestampToDateTime(stats.lastPulledTime)}</Text>
                                ) : (
                                    <Text>{t("sync.neverSynced")}</Text>
                                )}
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.stats}> {t("sync.localChanges")}</Text>
                                <Text> {stats.localChanges}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.stats}> {t("sync.remoteChanges")}</Text>
                                <Text>{stats.remoteChanges}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.stats}> {t("sync.versionName")}</Text>
                                <Text>{VERSION_NAME}</Text>
                            </View>
                        </>
                    ) : (
                        <></>
                    )}
                </Card>
                <Divider />
                <Text style={styles.cardSectionTitle}>{t("sync.syncSettings")}</Text>
                <Card style={styles.CardStyle}>
                    <View style={styles.row}>
                        <Text style={{ flex: 0.7, paddingRight: 10, margin: 10 }}>
                            {t("sync.autoSyncing")}
                        </Text>
                        <Switch
                            style={styles.switch}
                            trackColor={{ false: themeColors.white, true: themeColors.yellow }}
                            thumbColor={autoSync ? themeColors.white : themeColors.white}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={(value) => {
                                if (value == false) {
                                    SyncDatabaseTask.deactivateAutoSync();
                                }
                                setAutoSync(value);
                                storeAutoSync(value);
                            }}
                            value={autoSync}
                        ></Switch>
                    </View>
                    <View style={styles.row}>
                        <Text style={{ flex: 0.7, paddingRight: 10, margin: 10 }}>
                            {t("sync.syncOverCellular")}
                        </Text>
                        <Switch
                            style={styles.switch}
                            trackColor={{ false: themeColors.white, true: themeColors.yellow }}
                            thumbColor={cellularSync ? themeColors.white : themeColors.white}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={(value) => {
                                setCellularSync(value);
                                storeCellularSync(value);
                            }}
                            value={cellularSync}
                        ></Switch>
                    </View>
                </Card>
            </ScrollView>
            <SyncAlert
                displayMode={alertStatus ? "success" : "failed"}
                displayMsg={alertMessage}
                displaySubtitle={alertSubtitle}
                visibility={showSyncModal}
                dismissAlert={setSyncModal}
            />
            <SyncUpdateAlert
                visibility={showSyncUpdateModal}
                dismissAlert={setSyncUpdateModal}
                onConfirm={onSyncUpdateModalShutdown}
            />
        </SafeAreaView>
    );
};

export default Sync;
