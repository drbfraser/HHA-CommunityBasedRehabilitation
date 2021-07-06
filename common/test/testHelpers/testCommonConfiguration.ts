import { CommonConfiguration, KeyValStorageProvider } from "../../src/init";

export const testKeyValStorage = new Map<string, any>();

const mapStorageProvider: KeyValStorageProvider = {
    getItem: async (key: string): Promise<string | null> => {
        return testKeyValStorage.get(key) ?? null;
    },
    setItem: async (key: string, value: string) => {
        testKeyValStorage.set(key, value);
    },
    removeItem: async (key: string) => {
        testKeyValStorage.delete(key);
    },
};

export const logoutCallbacks: (() => void)[] = [];

export const testCommonConfig: CommonConfiguration = {
    apiUrl: "",
    keyValStorageProvider: mapStorageProvider,
    logoutCallback: async (): Promise<void> => {
        for (const callback of logoutCallbacks) {
            callback();
        }
    },
    shouldLogoutOnTokenRefreshFailure: false,
};
