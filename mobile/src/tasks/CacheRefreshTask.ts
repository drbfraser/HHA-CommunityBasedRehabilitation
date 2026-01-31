import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import NetInfo, { NetInfoChangeHandler } from "@react-native-community/netinfo";
import { invalidateAllCachedAPI, isLoggedIn } from "@cbr/common";
import {
    NetInfoState,
    NetInfoSubscription,
} from "@react-native-community/netinfo/src/internal/types";
import { Mutex } from "async-mutex";

export namespace CacheRefreshTask {
    /**
     * A task to periodically refresh cached API data (disabilities, zones, and the current user).
     * This only runs when the app is in the background.
     */
    const TASK_NAME = "cache-refresh-task";

    /** A tag for log statements. */
    const TASK_TAG = "CacheRefreshTask";

    /**
     * From the BackgroundFetch documentation: Inexact interval in seconds between subsequent
     * repeats of the background fetch alarm. The final interval may differ from the specified one
     * to minimize wakeups and battery usage.
     * @private
     */
    const CACHE_REFRESH_INTERVAL_SECONDS = 60 * 60 * 16; // 16 hours (refresh token expiry is 24)

    const refreshMutex = new Mutex();

    TaskManager.defineTask(TASK_NAME, async () => {
        console.log(`${TASK_TAG}: Running task`);
        // Because Expo's TaskManager / BackgroundFetch doesn't use JobScheduler's network
        // constraints (or use an approach like androidx.work's when working with AlarmManager),
        // tasks will run regardless of whether there is internet connectivity. There is no support
        // in TaskManager / BackgroundFetch for only running only if there is internet.
        //
        // If there is no internet, we workaround this case by adding a NetInfo listener that will
        // refresh the cache once there is internet; however, it's unclear whether this is reliable
        // if the app is in Doze state for Android. Nevertheless, the alarm won't fire if the device
        // is Dozing.
        const netInfoState = await NetInfo.fetch();
        if (netInfoState.isInternetReachable) {
            unsubscribeNetInfoListener();
        } else {
            console.log(`${TASK_TAG}: Task failed: No internet connectivity`);
            if (!netInfoUnsubscribeFunction) {
                console.log(
                    `${TASK_TAG}: Registering NetInfo listener to run when internet state changes`,
                );
                netInfoUnsubscribeFunction = NetInfo.addEventListener(netInfoEventListener);
            }
            return BackgroundFetch.BackgroundFetchResult.Failed;
        }

        return refreshMutex.runExclusive(() => {
            return refreshCachesLocked().then((cacheRefreshSuccess) => {
                if (cacheRefreshSuccess) {
                    console.log(`${TASK_TAG}: Task success`);
                    return BackgroundFetch.BackgroundFetchResult.NewData;
                } else {
                    console.log(`${TASK_TAG}: Task failed`);
                    return BackgroundFetch.BackgroundFetchResult.Failed;
                }
            });
        });
    });

    const netInfoEventListener: NetInfoChangeHandler = (state: NetInfoState) => {
        console.log(
            `${TASK_TAG}: netInfoEventListener: isInternetReachable: ${state.isInternetReachable}, isConnected: ${state.isConnected}`,
        );

        if (state.isInternetReachable) {
            refreshMutex
                .runExclusive(() => {
                    if (!netInfoUnsubscribeFunction) {
                        // The netInfoEventListener might be invoked multiple times in a small
                        // timespan. If we've already been unsubscribed by a previous, recent call,
                        // then don't refresh again.
                        return;
                    }

                    return refreshCachesLocked().then(() => unsubscribeNetInfoListener());
                })
                .catch((e) =>
                    console.log(`${TASK_TAG}: netInfoEventListener failed to refresh, ${e}`),
                );
        }
    };

    let netInfoUnsubscribeFunction: NetInfoSubscription | undefined = undefined;

    const unsubscribeNetInfoListener = () => {
        if (netInfoUnsubscribeFunction) {
            console.log(`${TASK_TAG}: unsubscribing netInfoEventListener`);
            netInfoUnsubscribeFunction();
            netInfoUnsubscribeFunction = undefined;
        }
    };

    /**
     * Should only be called when the {@link refreshMutex} is held.
     */
    const refreshCachesLocked = async (): Promise<boolean> => {
        try {
            if (!(await isLoggedIn())) {
                console.error(`${TASK_TAG}: refreshCaches(): failed, because not logged in`);
                return false;
            }

            // This will cause all caches to re-fetch. We work under the assumption that we have
            // internet connectivity.
            await invalidateAllCachedAPI("refresh");
            return true;
        } catch (e) {
            console.error(`${TASK_TAG}: refreshCaches(): failed, because error: ${e}`);
            return false;
        }
    };

    export const registerBackgroundFetch = async () => {
        console.log(
            `${TASK_TAG}: registerBackgroundFetch() with interval ${CACHE_REFRESH_INTERVAL_SECONDS} seconds`,
        );

        return BackgroundFetch.registerTaskAsync(TASK_NAME, {
            minimumInterval: CACHE_REFRESH_INTERVAL_SECONDS,
            startOnBoot: true,
            stopOnTerminate: false,
        });
    };

    export const unregisterBackgroundFetch = async () => {
        unsubscribeNetInfoListener();

        const taskRegistered = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
        console.log(
            `${TASK_TAG}: unregisterBackgroundFetch(): task registered before: ${taskRegistered}`,
        );

        if (taskRegistered) {
            return BackgroundFetch.unregisterTaskAsync(TASK_NAME);
        }
    };
}
