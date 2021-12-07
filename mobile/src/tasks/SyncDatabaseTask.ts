import BackgroundTimer from "react-native-background-timer";
import NetInfo, {
    NetInfoStateType,
    NetInfoState,
    NetInfoSubscription,
} from "@react-native-community/netinfo";
import { dbType } from "../util/watermelonDatabase";
import { SyncDB } from "../util/syncHandler";
import { Mutex } from "async-mutex";
import { store } from "../redux/store";

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

    export const autoSyncDatabase = (database: dbType) => {
        /* Remove running timer, if it exists */
        BackgroundTimer.stopBackgroundTimer();

        BackgroundTimer.runBackgroundTimer(async () => {
            if (netInfoState?.type == NetInfoStateType.wifi && netInfoState?.isInternetReachable) {
                console.log(`${TASK_TAG}: Syncing local DB with remote`);

                syncMutex.runExclusive(async () => {
                    await SyncDB(database);
                });
            }
        }, SYNC_INTERVAL_MILLISECONDS);
    };

    export const deactivateAutoSync = () => {
        console.log(`${TASK_TAG}: Stopped scheduled local DB sync`);

        BackgroundTimer.stopBackgroundTimer();
        netInfoUnsubscribe();
    };
}
