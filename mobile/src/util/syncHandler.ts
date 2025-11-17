import {
    apiFetch,
    ClientField,
    Endpoint,
    adminUserFieldLabels,
    APIFetchFailError,
} from "@cbr/common";
import {
    conflictFields,
    referralLabels,
    SyncConflict,
    getCleanClientColumn,
    getRejectedChange,
} from "./syncConflictConstants";
import { synchronize } from "@nozbe/watermelondb/src/sync";
import { database, dbType } from "./watermelonDatabase";
import NetInfo, { NetInfoState, NetInfoStateType } from "@react-native-community/netinfo";

//@ts-ignore
import SyncLogger from "@nozbe/watermelondb/sync/SyncLogger";

import { store } from "../redux/store";
import { addSyncConflicts } from "../redux/actions";
//@ts-ignore
import { hasUnsyncedChanges } from "@nozbe/watermelondb/sync";
import { ISync } from "../screens/Sync/Sync";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SyncSettings } from "../screens/Sync/PrefConstants";
import { modelName } from "../models/constant";
import { showGenericAlert } from "./genericAlert";

export const logger = new SyncLogger(10 /* limit of sync logs to keep in memory */);

export const mobileApiVersion: string = "5.0.0";

export async function checkUnsyncedChanges() {
    return await hasUnsyncedChanges({ database });
}

export async function AutoSyncDB(database: dbType, autoSync: boolean, cellularSync: boolean) {
    await NetInfo.fetch().then(async (connectionInfo: NetInfoState) => {
        switch (connectionInfo?.type) {
            case NetInfoStateType.cellular:
                if (autoSync && cellularSync && connectionInfo?.isInternetReachable) {
                    if (
                        !(await lastVersionSyncedIsCurrentVersion()) &&
                        !(await noPreviousSyncsPerformed())
                    ) {
                        showAutoSyncFailedAlert();
                    } else {
                        await SyncDB(database);
                    }
                }
                break;
            case NetInfoStateType.wifi:
                if (autoSync && connectionInfo?.isInternetReachable) {
                    if (
                        !(await lastVersionSyncedIsCurrentVersion()) &&
                        !(await noPreviousSyncsPerformed())
                    ) {
                        showAutoSyncFailedAlert();
                    } else {
                        await SyncDB(database);
                    }
                }
                break;
        }
    });
}

export async function SyncDB(database: dbType) {
    try {
        await synchronize({
            database,
            log: logger.newLog(),

            pullChanges: async ({ lastPulledAt }) => {
                const start = Date.now();
                console.log(`[SYNC PULL] lastPulledAt=${lastPulledAt}`);

                const urlParams = `?last_pulled_at=${lastPulledAt}&api_version=${mobileApiVersion}`;
                console.log(`[SYNC PULL] Fetching: ${Endpoint.SYNC}${urlParams}`);

                let response;
                try {
                    response = await apiFetch(Endpoint.SYNC, urlParams);
                } catch (err: any) {
                    console.log("[SYNC PULL] apiFetch ERROR");
                    console.log("message:", err?.message);
                    console.log("name:", err?.name);
                    console.log("stack:", err?.stack);
                }

                const latency = Date.now() - start;
                console.log(
                    `[SYNC PULL] Response status=${response.status} ok=${response.ok} latency=${latency}ms`
                );

                if (!response.ok) {
                    throw new Error(await response.text());
                }

                const { changes, timestamp } = await response.json();

                console.log(`[SYNC PULL] New timestamp=${timestamp}`);

                await getImage(changes);

                return { changes, timestamp };
            },

            pushChanges: async ({ changes, lastPulledAt }) => {
                const start = Date.now();
                console.log(`[SYNC PUSH] lastPulledAt=${lastPulledAt}`);

                const urlParams = `/?last_pulled_at=${lastPulledAt}&api_version=${mobileApiVersion}`;
                console.log(`[SYNC PUSH] Posting: ${Endpoint.SYNC}${urlParams}`);

                const init: RequestInit = {
                    method: "POST",
                    body: JSON.stringify(changes),
                };

                let response;
                try {
                    response = await apiFetch(Endpoint.SYNC, urlParams, init);
                } catch (err: any) {
                    console.log("[SYNC PUSH] apiFetch ERROR");
                    console.log("message:", err?.message);
                    console.log("name:", err?.name);
                    console.log("stack:", err?.stack);
                }

                const latency = Date.now() - start;
                console.log(
                    `[SYNC PUSH] Response status=${response.status} ok=${response.ok} latency=${latency}ms`
                );

                if (!response.ok) {
                    throw new Error(await response.text());
                }
            },

            migrationsEnabledAtVersion: 5,
            conflictResolver: conflictResolver,
        }).then(() => {
            console.log("[SYNC] Finished successfully");
            updateLastVersionSynced();
            storeStats();
        });
    } catch (e) {
        if (e instanceof APIFetchFailError && e.status === 403) {
            showGenericAlert(
                "Sync Is Not Compatible With Your Current Version Of CBR",
                "Please install the newest update of CBR on the Google Play Store."
            );
        }
    }
}

export async function preSyncOperations(database: dbType) {
    try {
        if (!(await lastVersionSyncedIsCurrentVersion())) {
            await database.write(async () => {
                await database.unsafeResetDatabase();
            });

            await AsyncStorage.removeItem(SyncSettings.SyncStats);
        }
    } catch (e) {
        console.error(e);
    }
}

function showAutoSyncFailedAlert() {
    showGenericAlert(
        "Automatic Sync Failed",
        "Please perform a manual sync to resolve this issue."
    );
}

export async function lastVersionSyncedIsCurrentVersion() {
    let lastVersionSynced = await AsyncStorage.getItem(SyncSettings.VersionLastSynced);

    return lastVersionSynced !== null && lastVersionSynced === mobileApiVersion;
}

async function noPreviousSyncsPerformed(): Promise<boolean> {
    try {
        const lastVersionSynced = await AsyncStorage.getItem(SyncSettings.VersionLastSynced);
        return lastVersionSynced === null;
    } catch (e) {
        console.error(e);
        return false;
    }
}

async function updateLastVersionSynced() {
    try {
        if (!(await lastVersionSyncedIsCurrentVersion())) {
            await AsyncStorage.setItem(SyncSettings.VersionLastSynced, mobileApiVersion);
        }
    } catch (e) {
        console.error(e);
    }
}

async function storeStats() {
    const len = logger.logs.length;
    if (len != 0) {
        let newStats: ISync = {
            lastPulledTime: logger.logs[len - 1].newLastPulledAt ?? 0,
            remoteChanges: logger.logs[len - 1].remoteChangeCount ?? 0,
            localChanges: logger.logs[len - 1].localChangeCount ?? 0,
        };
        try {
            await AsyncStorage.setItem(SyncSettings.SyncStats, JSON.stringify(newStats));
        } catch (e) {}
    }
}

async function getImage(changes) {
    await getImageData(changes[modelName.clients]["created"], Endpoint.CLIENT_PICTURE);
    await getImageData(changes[modelName.clients]["updated"], Endpoint.CLIENT_PICTURE);
    await getImageData(changes[modelName.referrals]["created"], Endpoint.REFERRAL_PICTURE);
    await getImageData(changes[modelName.referrals]["updated"], Endpoint.REFERRAL_PICTURE);
}

async function getImageData(changes, endpoint) {
    await Promise.all(
        changes.map(async (element) => {
            if (element.picture != null) {
                await apiFetch(endpoint, `${element.id}`)
                    .then((resp) => resp.blob())
                    .then((blob) => {
                        let reader = new FileReader();
                        reader.onload = () => {
                            element.picture = reader.result as string;
                        };
                        reader.readAsDataURL(blob);
                    });
            }
        })
    );
}

function riskResolver(raw, dirtyRaw, newRaw, column, timestamp) {
    if (raw[timestamp] > dirtyRaw[timestamp]) {
        return true;
    } else {
        newRaw[column] = dirtyRaw[column];
        newRaw[timestamp] = dirtyRaw[timestamp];
        return false;
    }
}

function conflictResolver(tableName, raw, dirtyRaw, newRaw) {
    let localChange = false;
    let clientConflicts: Map<string, SyncConflict> = new Map();
    let userConflicts: Map<string, SyncConflict> = new Map();

    const recordConflict = (column) => {
        if (conflictFields[tableName].has(column)) {
            if (tableName == modelName.clients) {
                if (!clientConflicts.has(newRaw.id)) {
                    clientConflicts.set(newRaw.id, {
                        name: dirtyRaw.full_name,
                        rejected: [],
                    });
                }

                clientConflicts.get(newRaw.id)?.rejected.push({
                    column: getCleanClientColumn(column),
                    rejChange: getRejectedChange(column, raw[column]).toString(),
                });
            } else if (tableName == modelName.referrals) {
                /* Referral conflicts are also stored under client ID object 
                   Full client name will be retrieved during component rendering */
                if (!clientConflicts.has(newRaw.client_id)) {
                    clientConflicts.set(newRaw.client_id, {
                        name: "",
                        rejected: [],
                    });
                }

                clientConflicts.get(newRaw.client_id)?.rejected.push({
                    column: referralLabels[column],
                    rejChange: raw[column].toString(),
                });
            } else if (tableName == modelName.users) {
                if (!userConflicts.has(newRaw.id)) {
                    userConflicts.set(newRaw.id, {
                        name: `${dirtyRaw.first_name} ${dirtyRaw.last_name}`,
                        rejected: [],
                    });
                }

                userConflicts.get(newRaw.id)?.rejected.push({
                    column: adminUserFieldLabels[column],
                    rejChange: raw[column].toString(),
                });
            }
        }
    };

    raw._changed.split(",").forEach((column) => {
        if (
            [
                ClientField.health_timestamp,
                ClientField.educat_timestamp,
                ClientField.social_timestamp,
                ClientField.nutrit_timestamp,
                ClientField.mental_timestamp,
            ].some((a) => a !== column)
        ) {
            if (
                [
                    ClientField.health_risk_level,
                    ClientField.educat_risk_level,
                    ClientField.social_risk_level,
                    ClientField.nutrit_risk_level,
                    ClientField.mental_risk_level,
                ].some((a) => a === column)
            ) {
                let riskType = column.split("_")[0];
                if (riskResolver(raw, dirtyRaw, newRaw, column, `${riskType}_timestamp`)) {
                    localChange = true;
                } else {
                    recordConflict(column);
                }
            } else if (column === "last_visit_date") {
                // if local last visit date is greater than server last visit date, then take local version
                if (raw[column] > dirtyRaw[column]) {
                    localChange = true;
                } else {
                    newRaw[column] = dirtyRaw[column];
                }
            } else if (column === "picture") {
                // if server image is null, then will push local changes up instead
                if (dirtyRaw[column] == null) {
                    localChange = true;
                } else {
                    recordConflict(column);
                    newRaw[column] = dirtyRaw[column];
                }
            } else if (column === "disability") {
                /* Server stores disabilities as [1, 2, ....] whereas
                   local stores disabilities as [1,2,...] so there is 
                   always a 'conflict' */
                if (newRaw[column].replace(",", ", ") == dirtyRaw[column]) {
                    localChange = true;
                } else {
                    recordConflict(column);
                    newRaw[column] = dirtyRaw[column];
                }
            } else {
                /* This is always server-side wins unless in cases specified above */
                recordConflict(column);
                newRaw[column] = dirtyRaw[column];
            }
        }
    });

    if (!localChange) {
        if (newRaw["_changed"] !== "") {
            newRaw["_changed"] = "";
        }
        if (newRaw["_status"] == "updated") {
            newRaw["_status"] = "synced";
        }
    }

    store.dispatch(addSyncConflicts(clientConflicts, userConflicts));

    return newRaw;
}
