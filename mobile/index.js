import { registerRootComponent } from "expo";
import App from "./src/App";
import { initializeCommon, invalidateAllCachedAPI } from "@cbr/common";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { CacheRefreshTask } from "./src/tasks/CacheRefreshTask";
import { SyncDatabaseTask } from "./src/tasks/SyncDatabaseTask";

const keyValStorageProvider = {
    getItem(key) {
        return AsyncStorage.getItem(key);
    },
    setItem(key, value) {
        return AsyncStorage.setItem(key, value);
    },
    removeItem(key) {
        return AsyncStorage.removeItem(key);
    },
};

const BASE_URLS = {
    local: process.env.LOCAL_URL ?? "",
    dev: "https://cbr-dev.cmpt.sfu.ca",
    staging: "https://cbr-stg.cmpt.sfu.ca",
    prod: "https://cbr.hopehealthaction.org",
};

const DEFAULT_APP_ENV = "dev";
let appEnv = process.env.APP_ENV ?? DEFAULT_APP_ENV;

if (appEnv === "local" && !BASE_URLS.local) {
    appEnv = DEFAULT_APP_ENV;
}

export const BASE_URL = BASE_URLS[appEnv];
export const API_URL = `${BASE_URL}/api/`;

initializeCommon({
    apiUrl: API_URL,
    socketIOUrl: BASE_URL,
    keyValStorageProvider: keyValStorageProvider,
    useKeyValStorageForCachedAPIBackup: true,
    // We don't want to logout when the user is offline and doesn't have internet (no internet means
    // refresh token attempt will fail). The user might have data stored offline (in the future). If
    // their refresh token expires, we need to ask them to login again without deleting all of their
    // data.
    shouldLogoutOnTokenRefreshFailure: false,
    logoutCallback: async () => {
        await CacheRefreshTask.unregisterBackgroundFetch();
        await invalidateAllCachedAPI("logout").catch((e) => {
            console.error(`Error while invalidating all cached API during logout: ${e}`);
        });
        SyncDatabaseTask.deactivateAutoSync();
        // TODO: Delete all other stored data in the app including client data, referrals, etc.
    },
    fetchErrorWrapper: async (e) => {
        if (e.message === "Network request failed") {
            const netInfoState = await NetInfo.fetch();
            return new Error(
                !netInfoState.isInternetReachable
                    ? "No internet available"
                    : "Unable to reach server "
            );
        }

        return e;
    },
});

registerRootComponent(App);
