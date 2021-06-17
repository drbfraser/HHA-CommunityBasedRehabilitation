export interface KeyValStorageProvider {
    getItem(key: string): Promise<string | null>;

    setItem(key: string, value: string): Promise<void>;
}

export interface CommonConfiguration {
    apiUrl: String;
    keyValStorageProvider: KeyValStorageProvider;
}

export let commonConfiguration: CommonConfiguration;

/**
 * Initializes the common module. This needs to be called on app startup.
 *
 * @param apiUrl The API url for connecting to the server. Should include `/api/` at the end.
 * @param keyValStorageProvider A provider for key-value storage.
 */
export const initializeCommon = (apiUrl: string, keyValStorageProvider: KeyValStorageProvider) => {
    commonConfiguration = {
        apiUrl: apiUrl,
        keyValStorageProvider: keyValStorageProvider,
    };
};
