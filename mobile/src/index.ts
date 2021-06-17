import { registerRootComponent } from "expo";
import App from "./App";
import { initializeCommon, KeyValStorageProvider } from "@cbr/common";
import AsyncStorage from "@react-native-async-storage/async-storage";

// TODO: read from some configuration a development URL / IP address
const API_URL = "https://cbrs.cradleplatform.com/api/";

const keyValStorageProvider: KeyValStorageProvider = {
    getItem(key: string): Promise<string | null> {
        return AsyncStorage.getItem(key);
    },
    setItem(key: string, value: string): Promise<void> {
        return AsyncStorage.setItem(key, value);
    },
};

initializeCommon({
    apiUrl: API_URL,
    keyValStorageProvider: keyValStorageProvider,
    // We don't want to logout when the user is offline and doesn't have internet (no internet means
    // refresh token attempt will fail). The user might have data stored offline (in the future). If
    // their refresh token expires, we need to ask them to login again without deleting all of their
    // data.
    shouldLogoutOnTokenRefreshFailure: false,
    // Use a null logoutCallback, since logging out should be handled by AuthContext.
    logoutCallback: null,
});

registerRootComponent(App);
