import { CommonConfiguration, KeyValStorageProvider } from "../../src/init";
import { jest } from "@jest/globals";

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

export const testCommonConfig: CommonConfiguration = {
    apiUrl: "",
    // socketIOUrl: "", // todosd: remove?
    keyValStorageProvider: mapStorageProvider,
    logoutCallback: async (): Promise<void> => {},
    shouldLogoutOnTokenRefreshFailure: false,
    useKeyValStorageForCachedAPIBackup: false,
};

/**
 * Creates a new common module and returns the importer's result. The new common module
 * is first initialized with {@link testCommonConfig} unless an override has been specified. Can be
 * used to isolate specific modules to avoid local module state between tests.
 *
 * This should only be called once in a single test, as it calls {@link jest.resetModules}
 * beforehand.
 *
 * @see jest.resetModules
 * @param importer A Promise / async function that resolves to an import, either using `import` or
 * require (as ES6 import syntax doesn't work with Jest's isolateModules. The imports here will be
 * from within the new common module.
 * @return The result of the importer.
 * @param commonConfigOverride An override for the isolated common module's
 * {@link commonConfiguration}.
 */
export const fromNewCommonModule = async <T>(
    importer: () => Promise<T>,
    commonConfigOverride?: CommonConfiguration
): Promise<T> => {
    jest.resetModules();
    return import("../../src/init")
        .then((result) => result.initializeCommon(commonConfigOverride ?? testCommonConfig))
        .then(() => importer());
};
