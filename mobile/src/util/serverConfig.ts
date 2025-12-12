import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
    baseUrl: "server_base_url",
    appEnv: "server_app_env",
};

const BASE_URLS = {
    local: process.env.LOCAL_URL ?? "",
    dev: "https://cbr-dev.cmpt.sfu.ca",
    staging: "https://cbr-stg.cmpt.sfu.ca",
    prod: "https://cbr.hopehealthaction.org",
};

const DEFAULT_APP_ENV = "dev";

const normalizeAppEnv = (env: string | null | undefined) => {
    let appEnv = env ?? DEFAULT_APP_ENV;
    if (appEnv === "local" && !BASE_URLS.local) {
        appEnv = DEFAULT_APP_ENV;
    }
    return appEnv;
};

export const buildApiUrl = (baseUrl: string) => `${baseUrl}/api/`;

export const getDefaultBaseUrl = () => {
    const appEnv = normalizeAppEnv(process.env.APP_ENV);
    return { baseUrl: BASE_URLS[appEnv], appEnv };
};

export const loadPersistedServer = async () => {
    try {
        const persistedBaseUrl = await AsyncStorage.getItem(STORAGE_KEYS.baseUrl);
        if (persistedBaseUrl) {
            return { baseUrl: persistedBaseUrl, source: "persisted" as const };
        }
        const storedAppEnv = await AsyncStorage.getItem(STORAGE_KEYS.appEnv);
        if (storedAppEnv) {
            const appEnv = normalizeAppEnv(storedAppEnv);
            return { baseUrl: BASE_URLS[appEnv], appEnv, source: "default" as const };
        }
    } catch (e) {
        console.error(`Failed to read persisted server base URL: ${e}`);
    }

    const { baseUrl, appEnv } = getDefaultBaseUrl();
    return { baseUrl, appEnv, source: "default" as const };
};

export const persistServerSelection = async (baseUrl: string, appEnv?: string) => {
    try {
        await AsyncStorage.setItem(STORAGE_KEYS.baseUrl, baseUrl);
        if (appEnv) {
            await AsyncStorage.setItem(STORAGE_KEYS.appEnv, appEnv);
        }
    } catch (e) {
        console.error(`Failed to persist server selection: ${e}`);
    }
};

export const getStorageKeys = () => ({ ...STORAGE_KEYS });

export const getBaseUrls = () => ({ ...BASE_URLS, defaultAppEnv: DEFAULT_APP_ENV });
