import { registerRootComponent } from "expo";
import App from "./App";
import { initializeCommon, KeyValStorageProvider } from "@cbr/common";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://cbrs.cradleplatform.com/api/";

const keyValStorageProvider: KeyValStorageProvider = {
    getItem(key: string): Promise<string | null> {
        return AsyncStorage.getItem(key);
    },
    setItem(key: string, value: string): Promise<void> {
        return AsyncStorage.setItem(key, value);
    },
};

initializeCommon(API_URL, keyValStorageProvider);

registerRootComponent(App);
