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

// use a null logoutCallback, since logging out should be handled by AuthContext.
initializeCommon(API_URL, keyValStorageProvider, null);

registerRootComponent(App);
