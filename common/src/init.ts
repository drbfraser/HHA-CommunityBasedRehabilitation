import { initSocketContext } from "./context/SocketIOContext";
// Initialize the i18n translations (done here in common, and in web or mobile)
import "./i18n.config";
export interface KeyValStorageProvider {
    readonly getItem: (key: string) => Promise<string | null>;
    readonly setItem: (key: string, value: string) => Promise<void>;
    readonly removeItem: (key: string) => Promise<void>;
}

export interface CommonConfiguration {
    /** The API url for connecting to the server. Should include `/api/` at the end. */
    apiUrl: string;
    socketIOUrl: string;
    /**
     * A provider interface for storing auth tokens and backups of cached API data if
     * {@link useKeyValStorageForCachedAPIBackup} is set.
     */
    readonly keyValStorageProvider: KeyValStorageProvider;
    /**
     * Whether to use the {@link keyValStorageProvider} to store backup values so that values can be
     * persisted as backup when initial {@link APICacheData.getCachedValue} calls fail. This is meant
     * for the mobile app to have a fallback for {@link APICacheData.getCachedValue} values when
     * there is no internet.
     */
    readonly useKeyValStorageForCachedAPIBackup: boolean;
    /** Whether to logout when {@link getAuthToken} fails to refresh the token. */
    readonly shouldLogoutOnTokenRefreshFailure: boolean;
    /** A callback to run after {@link doLogout} is called. */
    readonly logoutCallback: () => Promise<void>;
    /**
     * An optional wrapper that is invoked on errors that come from {@link apiFetch} to consume
     * it and possibly return a more specific error.
     */
    readonly fetchErrorWrapper?: (e: Error) => Promise<Error>;
}

export let commonConfiguration: CommonConfiguration;

/**
 * Initializes the common module. This needs to be called on app startup.
 */
export const initializeCommon = (config: CommonConfiguration) => {
    if (!commonConfiguration) {
        commonConfiguration = { ...config };
        initSocketContext(config.socketIOUrl);
    } else {
        console.error("trying to initialize common twice");
    }
};

export const updateCommonApiUrl = (apiUrl: string, socketIOUrl: string) => {
    if (!commonConfiguration) {
        console.error("Cannot change api url wihthout first initializing common");
        return;
    }

    commonConfiguration.apiUrl = apiUrl;
    commonConfiguration.socketIOUrl = socketIOUrl;

    initSocketContext(socketIOUrl);
};

/**
 * Reinitializes the common module, for testing purposes only. Should not be exported out of the
 * common module.
 *
 * @internal
 */
export const reinitializeCommon = (config: CommonConfiguration) => {
    commonConfiguration = { ...config };
};
