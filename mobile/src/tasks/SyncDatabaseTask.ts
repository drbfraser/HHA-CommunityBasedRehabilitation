import BackgroundTimer from "react-native-background-timer";
import NetInfo, { NetInfoStateType, NetInfoState, NetInfoSubscription } from "@react-native-community/netinfo";
import { dbType } from "../util/watermelonDatabase";
import { SyncDB } from "../util/syncHandler";
import { Mutex } from "async-mutex";
import { Alert } from "react-native";

const syncAlert = () =>
    Alert.alert(
      "Notice",
      "The local database is performing hourly sync",
      [
        { text: "OK", onPress: () => console.log("Sync Alert Dismissed") }
      ]
    );

export namespace SyncDatabaseTask {
    const TASK_TAG = "[SyncDatabaseTask]";
    const SYNC_INTERVAL_MILLISECONDS = 60 * 60 * 1000; /* 1 hour sync interval */

    const syncMutex = new Mutex();

    let netInfoState: NetInfoState;
    
    const netInfoUnsubscribe: NetInfoSubscription =  NetInfo.addEventListener((connectionState) => {
        /* Subscrube to Network state updates and update state */
        /* Calling function again will unsubscribe from updates */
        netInfoState = connectionState;
    });

    let intervalId = -1;
    export const autoSyncDatabase = (database: dbType) => {
        console.log("$$$$$$$")
        console.log(intervalId);
        if (intervalId == -1) {
            intervalId = BackgroundTimer.setInterval(async () => {
                if (netInfoState?.isInternetReachable && netInfoState?.type == NetInfoStateType.wifi) {
                    console.log(`${TASK_TAG}: Syncing local DB with remote`);

                    syncMutex.runExclusive(() => {
                        syncAlert();
                        SyncDB(database);
                    });
                }

            }, 30000);

            console.log("#####");
            console.log(intervalId);
        }
    }

    export const deactivateAutoSync = () => {
        console.log(`${TASK_TAG}: Stopped schedule local DB sync`);
        BackgroundTimer.clearInterval(intervalId);
        intervalId = -1;

        netInfoUnsubscribe();
        
        console.log("%%%%%%%");
        console.log(intervalId);
    }
}
