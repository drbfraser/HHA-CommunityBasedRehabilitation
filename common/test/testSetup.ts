import { commonConfiguration, initializeCommon, KeyValStorageProvider } from "../src/init";

export const testKeyValStorage = new Map<string, any>();

const localStorageProvider: KeyValStorageProvider = {
    getItem: async (key: string) => {
        return testKeyValStorage.get(key);
    },
    setItem: async (key: string, value: string) => {
        testKeyValStorage.set(key, value);
    },
    removeItem: async (key: string) => {
        testKeyValStorage.delete(key);
    },
};

exports.mochaHooks = {
    beforeEach() {
        testKeyValStorage.clear();
        if (!commonConfiguration) {
            initializeCommon({
                apiUrl: "",
                keyValStorageProvider: localStorageProvider,
                logoutCallback: async (): Promise<void> => {},
                shouldLogoutOnTokenRefreshFailure: false,
            });
        }
    },
};
