import { registerRootComponent } from "expo";
import App from "./src/App";
import { initializeCommon, invalidateAllCachedAPI, KeyValStorageProvider } from "@cbr/common";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Constants } from "react-native-unimodules";
import NetInfo from "@react-native-community/netinfo";
import { CacheRefreshTask } from "./src/tasks/CacheRefreshTask";

const keyValStorageProvider: KeyValStorageProvider = {
    getItem(key: string): Promise<string | null> {
        return AsyncStorage.getItem(key);
    },
    setItem(key: string, value: string): Promise<void> {
        return AsyncStorage.setItem(key, value);
    },
    removeItem(key: string): Promise<void> {
        return AsyncStorage.removeItem(key);
    },
};

initializeCommon({
    // Note: Constants will not be available if we eject from Expo's managed workflow.
    // @ts-ignore
    apiUrl: Constants.manifest.extra.apiUrl,
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
        // TODO: Delete all other stored data in the app including client data, referrals, etc.
    },
    fetchErrorWrapper: async (e: Error): Promise<Error> => {
        if (e.message === "Network request failed") {
            const netInfoState = await NetInfo.fetch();
            return new Error(
                !netInfoState.isInternetReachable
                    ? "No internet available"
                    : "Unable to reach server"
            );
        }

        return e;
    },
});

registerRootComponent(App);
