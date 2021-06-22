export interface KeyValStorageProvider {
    getItem: (key: string) => Promise<string | null>;
    setItem: (key: string, value: string) => Promise<void>;
}

export interface CommonConfiguration {
    /** The API url for connecting to the server. Should include `/api/` at the end. */
    apiUrl: String;
    /** A provider for key-value storage. */
    keyValStorageProvider: KeyValStorageProvider;
    /** Whether to logout when {@link getAuthToken} fails to refresh the token. */
    shouldLogoutOnTokenRefreshFailure: boolean;
    /** A callback to run after {@link doLogout} is called. */
    logoutCallback: () => Promise<void>;
}

export let commonConfiguration: CommonConfiguration;

/**
 * Initializes the common module. This needs to be called on app startup.
 */
export const initializeCommon = (config: CommonConfiguration) => {
    commonConfiguration = { ...config };
};
