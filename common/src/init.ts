export interface KeyValStorageProvider {
    readonly getItem: (key: string) => Promise<string | null>;
    readonly setItem: (key: string, value: string) => Promise<void>;
    readonly removeItem: (key: string) => Promise<void>;
}

export interface CommonConfiguration {
    /** The API url for connecting to the server. Should include `/api/` at the end. */
    readonly apiUrl: String;
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
    } else {
        console.error("trying to initialize common twice");
    }
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
