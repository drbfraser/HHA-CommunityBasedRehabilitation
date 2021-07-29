import {
    calls as mockedCalls,
    get as mockGet,
    MockResponseObject,
    reset as resetFetchMocks,
    resetBehavior as resetFetchMockBehavior,
} from "fetch-mock";
import {
    APICacheData,
    invalidateAllCachedAPIInternal,
    untrackAllCaches,
} from "../../../src/util/hooks/cachedAPI";
import { apiFetch, Endpoint } from "../../../src/util/endpoints";
import { addValidTokens } from "../../testHelpers/authTokenHelpers";
import { renderHook } from "@testing-library/react-hooks";
import { sleep } from "../../../src/util/sleep";
import { KeyValStorageProvider, reinitializeCommon } from "../../../src/init";
import { testCommonConfig, testKeyValStorage } from "../../testHelpers/testCommonConfiguration";

interface ITestData {
    a: string;
    b: number;
    c: boolean;
    d: string[];
}

const TEST_FAKE_ENDPOINT = "fakeEndpoint" as Endpoint;

const TEST_CACHE_KEY = "test_cache";

const TEST_CACHE2_KEY = TEST_CACHE_KEY + "_2";

const keyValStorageThatRejectsCacheKeys: KeyValStorageProvider = {
    getItem: async (key: string): Promise<string | null> => {
        return key.startsWith(TEST_CACHE_KEY)
            ? Promise.reject(new Error("for test reasons, getItem will always fail for cache"))
            : testKeyValStorage.get(key);
    },
    removeItem: async (key: string): Promise<void> => {
        if (key.startsWith(TEST_CACHE_KEY)) {
            return Promise.reject(
                new Error("for test reasons, removeItem will always fail for cache")
            );
        } else {
            testKeyValStorage.delete(key);
        }
    },
    setItem: async (key: string, value: string): Promise<void> => {
        if (key.startsWith(TEST_CACHE_KEY)) {
            return Promise.reject(
                new Error("for test reasons, setItem will always fail for cache")
            );
        } else {
            testKeyValStorage.set(key, value);
        }
    },
};

const createTestCache = (key: string = TEST_CACHE_KEY) => {
    return new APICacheData(
        key,
        () => apiFetch(TEST_FAKE_ENDPOINT),
        (data: ITestData) => data,
        "loading",
        "error"
    );
};

const mockSuccessGetWithDelayedResponse = (responseBody: any) => {
    mockGet(TEST_FAKE_ENDPOINT, async (): Promise<MockResponseObject> => {
        // to ensure loading value is always used
        await sleep(10);
        return {
            status: 200,
            body: JSON.stringify(responseBody),
        };
    });
};

beforeEach(async () => {
    await invalidateAllCachedAPIInternal(true, true, false, false);
    untrackAllCaches();
    resetFetchMocks();
    await addValidTokens();
});

describe("cachedAPI.ts", () => {
    describe("invalidateAllCachedAPI", () => {
        let firstCache: APICacheData<ITestData, string, string>;
        let secondCache: APICacheData<ITestData, string, string>;
        const expectedTestData: ITestData = {
            a: "This is string A, B, and C",
            b: 53224,
            c: true,
            d: ["E", "A", "T", "A"],
        };
        beforeEach(() => {
            firstCache = createTestCache(TEST_CACHE_KEY);
            secondCache = createTestCache(TEST_CACHE2_KEY);
            mockGet(TEST_FAKE_ENDPOINT, {
                status: 200,
                body: JSON.stringify(expectedTestData),
            });
        });

        it("should notifyListeners if notifyListeners is true and not if false", async () => {
            const firstCacheListener = jest.fn();
            firstCache.addInvalidationListener(firstCacheListener);
            const secondCacheListener = jest.fn();
            secondCache.addInvalidationListener(secondCacheListener);

            expect(await firstCache.getCachedValue()).toEqual(expectedTestData);
            expect(await secondCache.getCachedValue()).toEqual(expectedTestData);

            await invalidateAllCachedAPIInternal(false, false, false, true);
            expect(firstCacheListener).toBeCalledTimes(1);
            expect(secondCacheListener).toBeCalledTimes(1);

            await invalidateAllCachedAPIInternal(false, false, false, false);
            expect(firstCacheListener).toBeCalledTimes(1);
            expect(secondCacheListener).toBeCalledTimes(1);

            await invalidateAllCachedAPIInternal(false, false, false, true);
            expect(firstCacheListener).toBeCalledTimes(2);
            expect(secondCacheListener).toBeCalledTimes(2);

            firstCache.removeInvalidationListener(firstCacheListener);

            await invalidateAllCachedAPIInternal(false, false, false, true);
            expect(firstCacheListener).toBeCalledTimes(2);
            expect(secondCacheListener).toBeCalledTimes(3);
        });

        it("should invalidate all caches without affecting in-memory values if clearValues == false", async () => {
            expect(await firstCache.getCachedValue()).toEqual(expectedTestData);
            expect(firstCache.isInvalidated).toBe(false);
            expect(await secondCache.getCachedValue()).toEqual(expectedTestData);
            expect(secondCache.isInvalidated).toBe(false);

            await invalidateAllCachedAPIInternal(false, false, false);

            // The in-memory value should not be cleared.
            expect(await firstCache.value).toEqual(expectedTestData);
            expect(firstCache.isInvalidated).toBe(true);
            expect(await secondCache.value).toEqual(expectedTestData);
            expect(secondCache.isInvalidated).toBe(true);

            expect(await firstCache.getCachedValue()).toEqual(expectedTestData);
            expect(firstCache.isInvalidated).toBe(false);
            expect(await secondCache.getCachedValue()).toEqual(expectedTestData);
            expect(secondCache.isInvalidated).toBe(false);
        });

        it("should invalidate all caches and affect in-memory values if clearValues == true", async () => {
            expect(await firstCache.getCachedValue()).toEqual(expectedTestData);
            expect(firstCache.isInvalidated).toBe(false);
            expect(await secondCache.getCachedValue()).toEqual(expectedTestData);
            expect(secondCache.isInvalidated).toBe(false);

            await invalidateAllCachedAPIInternal(true, false, false, true);

            expect(await firstCache.value).toBeUndefined();
            expect(firstCache.isInvalidated).toBe(true);
            expect(await secondCache.value).toBeUndefined();
            expect(secondCache.isInvalidated).toBe(true);

            expect(await firstCache.getCachedValue()).toEqual(expectedTestData);
            expect(firstCache.isInvalidated).toBe(false);
            expect(await secondCache.getCachedValue()).toEqual(expectedTestData);
            expect(secondCache.isInvalidated).toBe(false);
        });

        it("should invalidate all caches and refetch from server if set", async () => {
            expect(await firstCache.getCachedValue()).toEqual(expectedTestData);
            expect(firstCache.isInvalidated).toBe(false);
            expect(await secondCache.getCachedValue()).toEqual(expectedTestData);
            expect(secondCache.isInvalidated).toBe(false);

            expect(mockedCalls().length).toBe(2);

            await invalidateAllCachedAPIInternal(true, false, true, true);

            expect(mockedCalls().length).toBe(4);

            expect(firstCache.value).toEqual(expectedTestData);
            expect(firstCache.isInvalidated).toBe(false);
            expect(secondCache.value).toEqual(expectedTestData);
            expect(secondCache.isInvalidated).toBe(false);
        });

        it("should invalidate all caches and clear backup values if set", async () => {
            reinitializeCommon({ ...testCommonConfig, useKeyValStorageForCachedAPIBackup: true });

            expect(await firstCache.getCachedValue()).toEqual(expectedTestData);
            expect(firstCache.isInvalidated).toBe(false);
            expect(await secondCache.getCachedValue()).toEqual(expectedTestData);
            expect(secondCache.isInvalidated).toBe(false);

            // Backup values are in the key value storage as strings.
            expect(testKeyValStorage.get(TEST_CACHE_KEY)).toEqual(JSON.stringify(expectedTestData));
            expect(testKeyValStorage.get(TEST_CACHE2_KEY)).toEqual(
                JSON.stringify(expectedTestData)
            );

            await invalidateAllCachedAPIInternal(true, true, false, true);

            expect(await firstCache.value).toBeUndefined();
            expect(firstCache.isInvalidated).toBe(true);
            expect(await secondCache.value).toBeUndefined();
            expect(secondCache.isInvalidated).toBe(true);

            expect(testKeyValStorage.get(TEST_CACHE_KEY)).toBeUndefined();
            expect(testKeyValStorage.get(TEST_CACHE2_KEY)).toBeUndefined();

            expect(await firstCache.getCachedValue()).toEqual(expectedTestData);
            expect(firstCache.isInvalidated).toBe(false);
            expect(await secondCache.getCachedValue()).toEqual(expectedTestData);
            expect(secondCache.isInvalidated).toBe(false);
        });

        it("should handle errors from clearing backups", async () => {
            reinitializeCommon({ ...testCommonConfig, useKeyValStorageForCachedAPIBackup: true });

            expect(await firstCache.getCachedValue()).toEqual(expectedTestData);
            expect(firstCache.isInvalidated).toBe(false);
            expect(await secondCache.getCachedValue()).toEqual(expectedTestData);
            expect(secondCache.isInvalidated).toBe(false);

            // Backup values are in the key value storage as strings.
            expect(testKeyValStorage.get(TEST_CACHE_KEY)).toEqual(JSON.stringify(expectedTestData));
            expect(testKeyValStorage.get(TEST_CACHE2_KEY)).toEqual(
                JSON.stringify(expectedTestData)
            );

            reinitializeCommon({
                ...testCommonConfig,
                keyValStorageProvider: keyValStorageThatRejectsCacheKeys,
                useKeyValStorageForCachedAPIBackup: true,
            });
            await invalidateAllCachedAPIInternal(true, true, false, true);

            expect(await firstCache.value).toBeUndefined();
            expect(firstCache.isInvalidated).toBe(true);
            expect(await secondCache.value).toBeUndefined();
            expect(secondCache.isInvalidated).toBe(true);
        });
    });

    describe("APICacheData.invalidate", () => {
        it("should notify listeners if notifyListeners is true and not if false", async () => {
            const cache = createTestCache();
            const listener = jest.fn(() => {});
            cache.addInvalidationListener(listener);
            expect(listener).toHaveBeenCalledTimes(0);

            const expectedTestData: ITestData = {
                a: "This is string A",
                b: 54,
                c: true,
                d: ["a", "c", "d", "c"],
            };
            mockGet(TEST_FAKE_ENDPOINT, {
                status: 200,
                body: JSON.stringify(expectedTestData),
            });
            expect(await cache.getCachedValue()).toEqual(expectedTestData);

            await cache.invalidate(false, false, false, true);
            expect(listener).toHaveBeenCalledTimes(1);

            const newListener = jest.fn(() => {});
            cache.addInvalidationListener(newListener);

            await cache.invalidate(false, false, false, true);
            expect(listener).toHaveBeenCalledTimes(2);
            expect(newListener).toHaveBeenCalledTimes(1);

            await cache.invalidate(false, false, false, /*notifyListeners=*/ false);
            expect(listener).toHaveBeenCalledTimes(2);
            expect(newListener).toHaveBeenCalledTimes(1);

            cache.removeInvalidationListener(listener);
            await cache.invalidate(false, false, false, true);
            expect(listener).toHaveBeenCalledTimes(2);
        });
    });

    describe("APICacheData.getCachedValue", () => {
        it("should not refetch if refreshValue is false", async () => {
            const expectedTestData: ITestData = {
                a: "This is string A",
                b: 54,
                c: true,
                d: ["a", "c", "d", "c"],
            };

            mockGet(TEST_FAKE_ENDPOINT, {
                status: 200,
                body: JSON.stringify(expectedTestData),
            });

            const cache = createTestCache();
            expect(await cache.getCachedValue(false)).toEqual(expectedTestData);
            expect(mockedCalls().length).toBe(1);

            // Make sure a subsequent call to getCachedValue with refreshValue false doesn't refetch.
            resetFetchMockBehavior();
            const otherTestData: ITestData = {
                a: "nt",
                b: -2323,
                c: false,
                d: ["aaaaaaaaaaa"],
            };
            mockGet(TEST_FAKE_ENDPOINT, {
                status: 200,
                body: JSON.stringify(otherTestData),
            });
            expect(await cache.getCachedValue(false)).toEqual(expectedTestData);
            expect(mockedCalls().length).toBe(1);

            const newCacheInstance = createTestCache();
            expect(await newCacheInstance.getCachedValue(false)).toEqual(otherTestData);
            expect(mockedCalls().length).toBe(2);
        });

        it("should refetch and notify listeners if refreshValue is true", async () => {
            const expectedTestData: ITestData = {
                a: "This is string A",
                b: 54,
                c: true,
                d: ["a", "c", "d", "c"],
            };

            mockGet(TEST_FAKE_ENDPOINT, {
                status: 200,
                body: JSON.stringify(expectedTestData),
            });

            const cache = createTestCache();
            const listener = jest.fn(() => {});
            cache.addInvalidationListener(listener);

            expect(await cache.getCachedValue(false)).toEqual(expectedTestData);
            expect(mockedCalls().length).toBe(1);
            expect(listener).toBeCalledTimes(0);

            const newExpectedTestData: ITestData = {
                a: "ABCD",
                b: 11223344,
                c: true,
                d: ["a", "c", "d", "c", "c", "d", "c"],
            };

            resetFetchMockBehavior();
            mockGet(TEST_FAKE_ENDPOINT, {
                status: 200,
                body: JSON.stringify(newExpectedTestData),
            });

            expect(await cache.getCachedValue(true)).toEqual(newExpectedTestData);
            expect(mockedCalls().length).toBe(2);
            expect(listener).toBeCalledTimes(1);

            cache.removeInvalidationListener(listener);
            expect(await cache.getCachedValue(true)).toEqual(newExpectedTestData);
            expect(mockedCalls().length).toBe(3);
            expect(listener).toBeCalledTimes(1);
        });

        it("should give error value if server returns error", async () => {
            mockGet(TEST_FAKE_ENDPOINT, { status: 500 });
            const cache = createTestCache();
            expect(await cache.getCachedValue()).toBe(cache.errorValue);
        });

        it(`should use previous in-memory value if invalidated with 
            in-memory values preserved and server fails`, async () => {
            const expectedTestData: ITestData = {
                a: "This is not string A",
                b: -344534,
                c: false,
                d: ["AAAAAAAAA", 'CCCCCCCCCCCCCC"'],
            };

            mockGet(TEST_FAKE_ENDPOINT, {
                status: 200,
                body: JSON.stringify(expectedTestData),
            });
            const cache = createTestCache();
            expect(await cache.getCachedValue()).toEqual(expectedTestData);
            await cache.invalidate(false, false, false, true);

            resetFetchMockBehavior();
            mockGet(TEST_FAKE_ENDPOINT, { status: 500 });

            expect(await cache.getCachedValue()).toEqual(expectedTestData);
        });

        it("should not throw if server sends a different interface", async () => {
            const wrongInterfaceData = {
                notInTheInterface: "This is string A",
                looselyTypedStuff: 1000,
            };

            mockGet(TEST_FAKE_ENDPOINT, {
                status: 200,
                body: JSON.stringify(wrongInterfaceData),
            });

            const value: ITestData | string = await createTestCache().getCachedValue();
            expect(value).toEqual(wrongInterfaceData);
        });

        it("should use backup if configured and server can't be reached but data stored before", async () => {
            reinitializeCommon({ ...testCommonConfig, useKeyValStorageForCachedAPIBackup: true });
            const cache = createTestCache();

            mockGet(TEST_FAKE_ENDPOINT, { status: 500 });
            expect(await cache.getCachedValue()).toEqual(cache.errorValue);

            const expectedTestData: ITestData = {
                a: "This is string A",
                b: 54,
                c: true,
                d: ["a", "c", "d", "c"],
            };

            resetFetchMockBehavior();
            mockGet(TEST_FAKE_ENDPOINT, {
                status: 200,
                body: JSON.stringify(expectedTestData),
            });

            expect(await cache.getCachedValue()).toEqual(expectedTestData);

            resetFetchMockBehavior();
            mockGet(TEST_FAKE_ENDPOINT, { status: 500 });
            // Invalidate and also clear the in-memory value.
            await cache.invalidate(true, false, false, true);
            expect(await cache.getCachedValue()).toEqual(expectedTestData);
        });

        it("shouldn't use backup if not configured and server can't be reached", async () => {
            reinitializeCommon({ ...testCommonConfig, useKeyValStorageForCachedAPIBackup: false });
            const expectedTestData: ITestData = {
                a: "This is string A",
                b: 54,
                c: true,
                d: ["a", "c", "d", "c"],
            };
            mockGet(TEST_FAKE_ENDPOINT, {
                status: 200,
                body: JSON.stringify(expectedTestData),
            });

            const cache = createTestCache();
            expect(await cache.getCachedValue()).toEqual(expectedTestData);

            resetFetchMockBehavior();
            mockGet(TEST_FAKE_ENDPOINT, { status: 500 });

            // Invalidate and also clear the in-memory value.
            await cache.invalidate(true, false, false, true);
            expect(await cache.getCachedValue()).toEqual(cache.errorValue);
        });

        it("shouldn't fail if configured to store backups but storage fails", async () => {
            reinitializeCommon({
                ...testCommonConfig,
                keyValStorageProvider: keyValStorageThatRejectsCacheKeys,
                useKeyValStorageForCachedAPIBackup: true,
            });
            const cache = createTestCache();
            const expectedTestData: ITestData = {
                a: "This is string A",
                b: 54,
                c: true,
                d: ["a", "c", "d", "c"],
            };
            mockGet(TEST_FAKE_ENDPOINT, {
                status: 200,
                body: JSON.stringify(expectedTestData),
            });

            expect(await cache.getCachedValue()).toEqual(expectedTestData);

            resetFetchMockBehavior();
            mockGet(TEST_FAKE_ENDPOINT, { status: 500 });

            // Invalidate and also clear the in-memory value.
            await cache.invalidate(true, true);
            // The server response fails and the backup fails, and the cache was invalidated such
            // that the previous in-memory values are cleared. We have no value to rely on, so we
            // expect the errorValue to be used here.
            expect(await cache.getCachedValue()).toEqual(cache.errorValue);
        });
    });

    describe("APICacheData.useCacheHook", () => {
        it("should initially use loading value, then the transformed server response", async () => {
            const expectedTestData: ITestData = {
                a: "This is string ABC",
                b: 54,
                c: true,
                d: ["a", "c", "d", "c"],
            };

            mockGet(TEST_FAKE_ENDPOINT, async (): Promise<MockResponseObject> => {
                // to ensure loading value is always used
                await sleep(10);
                return {
                    status: 200,
                    body: JSON.stringify(expectedTestData),
                };
            });

            const cache = createTestCache();
            const useCache = cache.useCacheHook();
            const renderHookResult = renderHook(() => useCache());
            expect(renderHookResult.result.current).toEqual(cache.loadingValue);
            await renderHookResult.waitForNextUpdate();
            expect(renderHookResult.result.current).toEqual(expectedTestData);
            renderHookResult.unmount();
            expect(cache.promise).not.toBeUndefined();
            expect(cache.value).toEqual(expectedTestData);

            // Another component that uses the hook shouldn't have to load it again.
            const renderHookResultAfter = renderHook(() => useCache());
            expect(renderHookResultAfter.result.current).toEqual(expectedTestData);
            renderHookResultAfter.unmount();
        });

        it("should use error value when server sends error", async () => {
            mockGet(TEST_FAKE_ENDPOINT, async (): Promise<MockResponseObject> => {
                // to ensure loading value is always used
                await sleep(10);
                return { status: 500 };
            });

            const cache = createTestCache();
            const useCache = cache.useCacheHook();
            const renderHookResult = renderHook(() => useCache());
            expect(renderHookResult.result.current).toEqual(cache.loadingValue);
            await renderHookResult.waitForNextUpdate();
            expect(renderHookResult.result.current).toEqual(cache.errorValue);
            renderHookResult.unmount();
            expect(cache.promise).toBeUndefined();
            expect(cache.value).toBeUndefined();
        });

        it("should respond to invalidations", async () => {
            const firstTestDataValues: ITestData = {
                a: "Old test data",
                b: -345,
                c: true,
                d: [],
            };
            mockSuccessGetWithDelayedResponse(firstTestDataValues);
            const cache = createTestCache();
            const useCache = cache.useCacheHook();

            const firstReactComponent = renderHook(() => useCache());
            expect(firstReactComponent.result.current).toEqual(cache.loadingValue);
            await firstReactComponent.waitForNextUpdate();
            expect(firstReactComponent.result.current).toEqual(firstTestDataValues);

            const secondReactComponent = renderHook(() => useCache());
            expect(secondReactComponent.result.current).toEqual(firstTestDataValues);

            resetFetchMockBehavior();
            const secondTestDataValues: ITestData = {
                a: "New test data",
                b: 11354545,
                c: false,
                d: ['These are different values"` " Yes.'],
            };
            mockSuccessGetWithDelayedResponse(secondTestDataValues);

            await invalidateAllCachedAPIInternal(false, false, false, true);
            // It should initially still use the first data values.
            expect(firstReactComponent.result.current).toEqual(firstTestDataValues);
            expect(secondReactComponent.result.current).toEqual(firstTestDataValues);
            await Promise.all([
                firstReactComponent.waitForNextUpdate(),
                secondReactComponent.waitForNextUpdate(),
            ]);
            expect(firstReactComponent.result.current).toEqual(secondTestDataValues);
            expect(secondReactComponent.result.current).toEqual(secondTestDataValues);

            resetFetchMockBehavior();
            mockSuccessGetWithDelayedResponse(firstTestDataValues);

            await invalidateAllCachedAPIInternal(true, false, false, true);
            await Promise.all([
                firstReactComponent.waitForNextUpdate(),
                secondReactComponent.waitForNextUpdate(),
            ]);
            expect(firstReactComponent.result.current).toEqual(firstTestDataValues);
            expect(secondReactComponent.result.current).toEqual(firstTestDataValues);

            firstReactComponent.unmount();
            secondReactComponent.unmount();
        });
    });
});
