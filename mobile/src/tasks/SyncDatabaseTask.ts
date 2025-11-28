import NetInfo, { NetInfoState, NetInfoSubscription } from "@react-native-community/netinfo";
import { dbType } from "../util/watermelonDatabase";
import { AutoSyncDB } from "../util/syncHandler";
import { Mutex } from "async-mutex";

type BackgroundTimerType = typeof import("react-native-background-timer").default;

let backgroundTimerInstance: BackgroundTimerType | null = null;

const getBackgroundTimer = (): BackgroundTimerType => {
    if (!backgroundTimerInstance) {
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const { NativeModules } = require("react-native");
            const mod = NativeModules?.RNBackgroundTimer;
            if (mod && typeof mod === "object") {
                if (typeof mod.addListener !== "function") mod.addListener = () => {};
                if (typeof mod.removeListeners !== "function") mod.removeListeners = () => {};
            }
        } catch {}

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const module = require("react-native-background-timer");
        backgroundTimerInstance = module.default ?? module;
    }
    return backgroundTimerInstance!;
};

export namespace SyncDatabaseTask {
    const TASK_TAG = "[SyncDatabaseTask]";
    const SYNC_INTERVAL_MILLISECONDS = 60 * 60 * 1000; /* 1 hour sync interval */

    const syncMutex = new Mutex();

    let netInfoState: NetInfoState;

    const netInfoUnsubscribe: NetInfoSubscription = NetInfo.addEventListener((connectionState) => {
        /* Subscrube to Network state updates and update state */
        /* Calling function again will unsubscribe from updates */
        netInfoState = connectionState;
    });

    export const scheduleAutoSync = async (
        database: dbType,
        autoSync: boolean,
        cellularSync: boolean
    ) => {
        /* Remove running timer, if it exists */
        const BackgroundTimer = getBackgroundTimer();
        BackgroundTimer.stopBackgroundTimer();
        console.log(`${TASK_TAG}: Scheduling Auto Sync`);
        BackgroundTimer.runBackgroundTimer(async () => {
            console.log(`${TASK_TAG}: Syncing local DB with remote`);
            syncMutex.runExclusive(async () => {
                await AutoSyncDB(database, autoSync, cellularSync);
            });
        }, SYNC_INTERVAL_MILLISECONDS);
    };

    export const deactivateAutoSync = () => {
        console.log(`${TASK_TAG}: Stopped scheduled local DB sync`);

        const BackgroundTimer = getBackgroundTimer();
        BackgroundTimer.stopBackgroundTimer();
        netInfoUnsubscribe();
    };
}
