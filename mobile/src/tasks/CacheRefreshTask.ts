import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import NetInfo, { NetInfoChangeHandler } from "@react-native-community/netinfo";
import { invalidateAllCachedAPI, isLoggedIn } from "@cbr/common";
import {
    NetInfoState,
    NetInfoSubscription,
} from "@react-native-community/netinfo/src/internal/types";
import { Mutex } from "async-mutex";

// ---------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------

const TASK_NAME = "cache-refresh-task";
const TASK_TAG = "CacheRefreshTask";
const CACHE_REFRESH_INTERVAL_SECONDS = 60 * 60 * 16; // 16 hours (refresh token expiry is 24)

const refreshMutex = new Mutex();

let netInfoUnsubscribeFunction: NetInfoSubscription | undefined = undefined;

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------

const unsubscribeNetInfoListener = () => {
    if (netInfoUnsubscribeFunction) {
        console.log(`${TASK_TAG}: unsubscribing netInfoEventListener`);
        netInfoUnsubscribeFunction();
        netInfoUnsubscribeFunction = undefined;
    }
};

const refreshCachesLocked = async (): Promise<boolean> => {
    try {
        if (!(await isLoggedIn())) {
            console.error(`${TASK_TAG}: refreshCaches(): failed, because not logged in`);
            return false;
        }

        await invalidateAllCachedAPI("refresh");
        return true;
    } catch (e) {
        console.error(`${TASK_TAG}: refreshCaches(): failed, because error: ${e}`);
        return false;
    }
};

const netInfoEventListener: NetInfoChangeHandler = (state: NetInfoState) => {
    console.log(
        `${TASK_TAG}: netInfoEventListener: isInternetReachable: ${state.isInternetReachable}, isConnected: ${state.isConnected}`
    );

    if (state.isInternetReachable) {
        refreshMutex
            .runExclusive(() => {
                if (!netInfoUnsubscribeFunction) {
                    // Might have already been unsubscribed by a recent call
                    return;
                }

                return refreshCachesLocked().then(() => unsubscribeNetInfoListener());
            })
            .catch((e) => console.log(`${TASK_TAG}: netInfoEventListener failed to refresh, ${e}`));
    }
};

// ---------------------------------------------------------------------
// Define the background task (must be at top level for Expo 12+)
// ---------------------------------------------------------------------

TaskManager.defineTask(TASK_NAME, async () => {
    console.log(`${TASK_TAG}: Running task`);

    const netInfoState = await NetInfo.fetch();
    if (!netInfoState.isInternetReachable) {
        console.log(`${TASK_TAG}: Task failed: No internet connectivity`);
        if (!netInfoUnsubscribeFunction) {
            console.log(
                `${TASK_TAG}: Registering NetInfo listener to run when internet state changes`
            );
            netInfoUnsubscribeFunction = NetInfo.addEventListener(netInfoEventListener);
        }
        return BackgroundFetch.BackgroundFetchResult.Failed;
    } else {
        unsubscribeNetInfoListener();
    }

    return refreshMutex.runExclusive(() =>
        refreshCachesLocked().then((cacheRefreshSuccess) => {
            if (cacheRefreshSuccess) {
                console.log(`${TASK_TAG}: Task success`);
                return BackgroundFetch.BackgroundFetchResult.NewData;
            } else {
                console.log(`${TASK_TAG}: Task failed`);
                return BackgroundFetch.BackgroundFetchResult.Failed;
            }
        })
    );
});

// ---------------------------------------------------------------------
// Exported API
// ---------------------------------------------------------------------

export const CacheRefreshTask = {
    async registerBackgroundFetch() {
        console.log(
            `${TASK_TAG}: registerBackgroundFetch() with interval ${CACHE_REFRESH_INTERVAL_SECONDS} seconds`
        );

        return BackgroundFetch.registerTaskAsync(TASK_NAME, {
            minimumInterval: CACHE_REFRESH_INTERVAL_SECONDS,
            startOnBoot: true,
            stopOnTerminate: false,
        });
    },

    async unregisterBackgroundFetch() {
        unsubscribeNetInfoListener();

        const taskRegistered = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
        console.log(
            `${TASK_TAG}: unregisterBackgroundFetch(): task registered before: ${taskRegistered}`
        );

        if (taskRegistered) {
            return BackgroundFetch.unregisterTaskAsync(TASK_NAME);
        }
    },
};
