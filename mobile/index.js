// Polyfill NativeEventEmitter arg shape warnings as early as possible
import "./src/setup/nativeEventEmitterPolyfills";
import { registerRootComponent } from "expo";
import App from "./src/App";
import { initializeCommon, invalidateAllCachedAPI } from "@cbr/common";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { CacheRefreshTask } from "./src/tasks/CacheRefreshTask";
import { SyncDatabaseTask } from "./src/tasks/SyncDatabaseTask";
import i18n from "i18next";
import React, { useEffect, useState } from "react";
import { buildApiUrl, getDefaultBaseUrl, loadPersistedServer } from "./src/util/serverConfig";

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

const bootstrapServerConfig = async () => {
    const fallback = getDefaultBaseUrl();
    try {
        const persisted = await loadPersistedServer();
        const baseUrl = persisted.baseUrl ?? fallback.baseUrl;
        const apiUrl = buildApiUrl(baseUrl);

        initializeCommon({
            apiUrl: apiUrl,
            socketIOUrl: baseUrl,
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
                            ? i18n.t("login.noInternet")
                            : i18n.t("login.unableToReachServer"),
                    );
                }

                return e;
            },
        });
    } catch (e) {
        console.error("Failed to load persisted server config, using fallback", e);
        const apiUrl = buildApiUrl(fallback.baseUrl);
        initializeCommon({
            apiUrl: apiUrl,
            socketIOUrl: fallback.baseUrl,
            keyValStorageProvider: keyValStorageProvider,
            useKeyValStorageForCachedAPIBackup: true,
            shouldLogoutOnTokenRefreshFailure: false,
            logoutCallback: async () => {
                await CacheRefreshTask.unregisterBackgroundFetch();
                await invalidateAllCachedAPI("logout").catch((err) => {
                    console.error(`Error while invalidating all cached API during logout: ${err}`);
                });
                SyncDatabaseTask.deactivateAutoSync();
            },
            fetchErrorWrapper: async (err) => {
                if (err.message === "Network request failed") {
                    const netInfoState = await NetInfo.fetch();
                    return new Error(
                        !netInfoState.isInternetReachable
                            ? i18n.t("login.noInternet")
                            : i18n.t("login.unableToReachServer"),
                    );
                }
                return err;
            },
        });
    }
};

const bootstrapPromise = bootstrapServerConfig();

const BootstrapApp = () => {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        bootstrapPromise.finally(() => setReady(true));
    }, []);

    if (!ready) {
        return null;
    }

    return <App />;
};

registerRootComponent(BootstrapApp);
