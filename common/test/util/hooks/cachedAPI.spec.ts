import fetchMock, { MockResponseObject } from "fetch-mock";
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

const createTestCache = (key: string = TEST_CACHE_KEY, timeout?: number) => {
    return new APICacheData(
        key,
        (abortController) => apiFetch(TEST_FAKE_ENDPOINT, "", { signal: abortController.signal }),
        (data: ITestData) => data,
        "loading",
        "error",
        timeout
    );
};

const mockSuccessGetWithDelayedResponse = (responseBody: any, delayMs: number = 10) => {
    fetchMock.get(TEST_FAKE_ENDPOINT, async (): Promise<MockResponseObject> => {
        // to ensure loading value is always used
        await sleep(delayMs);
        return {
            status: 200,
            body: JSON.stringify(responseBody),
        };
    });
};

beforeEach(async () => {
    await invalidateAllCachedAPIInternal(true, true, false, false);
    untrackAllCaches();
    fetchMock.reset();
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
            fetchMock.get(TEST_FAKE_ENDPOINT, {
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
            expect(firstCache.promise).not.toBeUndefined();
            expect(await secondCache.getCachedValue()).toEqual(expectedTestData);
            expect(secondCache.promise).not.toBeUndefined();

            await invalidateAllCachedAPIInternal(false, false, false);

            // The in-memory value should not be cleared.
            expect(await firstCache.value).toEqual(expectedTestData);
            expect(firstCache.promise).toBeUndefined();
            expect(await secondCache.value).toEqual(expectedTestData);
            expect(secondCache.promise).toBeUndefined();

            expect(await firstCache.getCachedValue()).toEqual(expectedTestData);
            expect(firstCache.promise).not.toBeUndefined();
            expect(await secondCache.getCachedValue()).toEqual(expectedTestData);
            expect(secondCache.promise).not.toBeUndefined();
        });

        it("should invalidate all caches and affect in-memory values if clearValues == true", async () => {
            expect(await firstCache.getCachedValue()).toEqual(expectedTestData);
            expect(firstCache.promise).not.toBeUndefined();
            expect(await secondCache.getCachedValue()).toEqual(expectedTestData);
            expect(secondCache.promise).not.toBeUndefined();

            await invalidateAllCachedAPIInternal(true, false, false, true);

            expect(await firstCache.value).toBeUndefined();
            expect(firstCache.promise).toBeUndefined();
            expect(await secondCache.value).toBeUndefined();
            expect(secondCache.promise).toBeUndefined();

            expect(await firstCache.getCachedValue()).toEqual(expectedTestData);
            expect(firstCache.promise).not.toBeUndefined();
            expect(await secondCache.getCachedValue()).toEqual(expectedTestData);
            expect(secondCache.promise).not.toBeUndefined();
        });

        it("should invalidate all caches and refetch from server if set", async () => {
            expect(await firstCache.getCachedValue()).toEqual(expectedTestData);
            expect(firstCache.promise).not.toBeUndefined();
            expect(await secondCache.getCachedValue()).toEqual(expectedTestData);
            expect(secondCache.promise).not.toBeUndefined();

            expect(fetchMock.calls().length).toBe(2);

            await invalidateAllCachedAPIInternal(true, false, true, true);

            expect(fetchMock.calls().length).toBe(4);

            expect(firstCache.value).toEqual(expectedTestData);
            expect(firstCache.promise).not.toBeUndefined();
            expect(secondCache.value).toEqual(expectedTestData);
            expect(secondCache.promise).not.toBeUndefined();
        });

        it("should invalidate all caches and clear backup values if set", async () => {
            reinitializeCommon({ ...testCommonConfig, useKeyValStorageForCachedAPIBackup: true });

            expect(await firstCache.getCachedValue()).toEqual(expectedTestData);
            expect(firstCache.promise).not.toBeUndefined();
            expect(await secondCache.getCachedValue()).toEqual(expectedTestData);
            expect(secondCache.promise).not.toBeUndefined();

            // Backup values are in the key value storage as strings.
            expect(testKeyValStorage.get(TEST_CACHE_KEY)).toEqual(JSON.stringify(expectedTestData));
            expect(testKeyValStorage.get(TEST_CACHE2_KEY)).toEqual(
                JSON.stringify(expectedTestData)
            );

            await invalidateAllCachedAPIInternal(true, true, false, true);

            expect(await firstCache.value).toBeUndefined();
            expect(firstCache.promise).toBeUndefined();
            expect(await secondCache.value).toBeUndefined();
            expect(secondCache.promise).toBeUndefined();

            expect(testKeyValStorage.get(TEST_CACHE_KEY)).toBeUndefined();
            expect(testKeyValStorage.get(TEST_CACHE2_KEY)).toBeUndefined();

            expect(await firstCache.getCachedValue()).toEqual(expectedTestData);
            expect(firstCache.promise).not.toBeUndefined();
            expect(await secondCache.getCachedValue()).toEqual(expectedTestData);
            expect(secondCache.promise).not.toBeUndefined();
        });

        it("should handle errors from clearing backups", async () => {
            reinitializeCommon({ ...testCommonConfig, useKeyValStorageForCachedAPIBackup: true });

            expect(await firstCache.getCachedValue()).toEqual(expectedTestData);
            expect(firstCache.promise).not.toBeUndefined();
            expect(await secondCache.getCachedValue()).toEqual(expectedTestData);
            expect(secondCache.promise).not.toBeUndefined();

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
            expect(firstCache.promise).toBeUndefined();
            expect(await secondCache.value).toBeUndefined();
            expect(secondCache.promise).toBeUndefined();
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
            fetchMock.get(TEST_FAKE_ENDPOINT, {
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

        it("should wait until previous promises are resolved", async () => {
            reinitializeCommon({ ...testCommonConfig, useKeyValStorageForCachedAPIBackup: true });
            const cache = createTestCache();
            const expectedTestData: ITestData = { a: "A string", b: -10, c: true, d: ["a", "c"] };
            fetchMock.get(TEST_FAKE_ENDPOINT, async () => {
                await sleep(75);
                return {
                    status: 200,
                    body: JSON.stringify(expectedTestData),
                };
            });

            const initialPromise = cache.getCachedValue();
            await sleep(25);
            await cache.invalidate(true, true, false, false);
            await sleep(100);
            // After invalidating with clearBackup set to true, the backup should actually be
            // undefined.
            expect(testKeyValStorage.get(cache.cacheBackupKey)).toBeUndefined();
            expect(cache.value).toBeUndefined();
            expect(cache.promise).toBeUndefined();
            // The initial promise should abort.
            expect(await initialPromise).toEqual(cache.errorValue);
        });
    });

    describe("APICacheData.fetchTimeout", () => {
        jest.setTimeout(6000); // extend duration of this test for a timeout to occur
        it("should timeout", async () => {
            const cache = createTestCache(TEST_CACHE_KEY, 500);
            const listener = jest.fn(() => {});
            cache.addInvalidationListener(listener);
            expect(listener).toHaveBeenCalledTimes(0);

            const expectedData = {
                a: "Should not get this object on first run",
                b: 235235235,
                c: false,
                d: ["why"],
            } as ITestData;

            let slowResponse = true;
            fetchMock.get(TEST_FAKE_ENDPOINT, async () => {
                if (slowResponse) {
                    await sleep(5000);
                }
                return {
                    status: 200,
                    body: JSON.stringify(expectedData),
                };
            });
            expect(await cache.getCachedValue()).toEqual(cache.errorValue);
            slowResponse = false;
            expect(await cache.getCachedValue()).toEqual(expectedData);
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

            fetchMock.get(TEST_FAKE_ENDPOINT, {
                status: 200,
                body: JSON.stringify(expectedTestData),
            });

            const cache = createTestCache();
            expect(await cache.getCachedValue(false)).toEqual(expectedTestData);
            expect(fetchMock.calls().length).toBe(1);

            // Make sure a subsequent call to getCachedValue with refreshValue false doesn't refetch.
            fetchMock.resetBehavior();
            const otherTestData: ITestData = {
                a: "nt",
                b: -2323,
                c: false,
                d: ["aaaaaaaaaaa"],
            };
            fetchMock.get(TEST_FAKE_ENDPOINT, {
                status: 200,
                body: JSON.stringify(otherTestData),
            });
            expect(await cache.getCachedValue(false)).toEqual(expectedTestData);
            expect(fetchMock.calls().length).toBe(1);

            const newCacheInstance = createTestCache();
            expect(await newCacheInstance.getCachedValue(false)).toEqual(otherTestData);
            expect(fetchMock.calls().length).toBe(2);
        });

        it("should refetch and notify listeners if refreshValue is true", async () => {
            const expectedTestData: ITestData = {
                a: "This is string A",
                b: 54,
                c: true,
                d: ["a", "c", "d", "c"],
            };

            fetchMock.get(TEST_FAKE_ENDPOINT, {
                status: 200,
                body: JSON.stringify(expectedTestData),
            });

            const cache = createTestCache();
            const listener = jest.fn(() => {});
            cache.addInvalidationListener(listener);

            expect(await cache.getCachedValue(false)).toEqual(expectedTestData);
            expect(fetchMock.calls().length).toBe(1);
            expect(listener).toBeCalledTimes(0);

            const newExpectedTestData: ITestData = {
                a: "ABCD",
                b: 11223344,
                c: true,
                d: ["a", "c", "d", "c", "c", "d", "c"],
            };

            fetchMock.resetBehavior();
            fetchMock.get(TEST_FAKE_ENDPOINT, {
                status: 200,
                body: JSON.stringify(newExpectedTestData),
            });

            expect(await cache.getCachedValue(true)).toEqual(newExpectedTestData);
            expect(fetchMock.calls().length).toBe(2);
            expect(listener).toBeCalledTimes(1);

            cache.removeInvalidationListener(listener);
            expect(await cache.getCachedValue(true)).toEqual(newExpectedTestData);
            expect(fetchMock.calls().length).toBe(3);
            expect(listener).toBeCalledTimes(1);
        });

        it("should give error value if server returns error", async () => {
            fetchMock.get(TEST_FAKE_ENDPOINT, { status: 500 });
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

            fetchMock.get(TEST_FAKE_ENDPOINT, {
                status: 200,
                body: JSON.stringify(expectedTestData),
            });
            const cache = createTestCache();
            expect(await cache.getCachedValue()).toEqual(expectedTestData);
            await cache.invalidate(false, false, false, true);

            fetchMock.resetBehavior();
            fetchMock.get(TEST_FAKE_ENDPOINT, { status: 500 });

            expect(await cache.getCachedValue()).toEqual(expectedTestData);
        });

        it("should not throw if server sends a different interface", async () => {
            const wrongInterfaceData = {
                notInTheInterface: "JavaScript is loosely typed",
                looselyTypedStuff: 1000,
            };

            fetchMock.get(TEST_FAKE_ENDPOINT, {
                status: 200,
                body: JSON.stringify(wrongInterfaceData),
            });

            const value: ITestData | string = await createTestCache().getCachedValue();
            expect(value).toEqual(wrongInterfaceData);
        });

        it("should use backup if configured and server can't be reached but data stored before", async () => {
            reinitializeCommon({ ...testCommonConfig, useKeyValStorageForCachedAPIBackup: true });
            const cache = createTestCache();

            fetchMock.get(TEST_FAKE_ENDPOINT, { status: 500 });
            expect(await cache.getCachedValue()).toEqual(cache.errorValue);

            const expectedTestData: ITestData = {
                a: "This is string A",
                b: 54,
                c: true,
                d: ["a", "c", "d", "c"],
            };

            fetchMock.resetBehavior();
            fetchMock.get(TEST_FAKE_ENDPOINT, {
                status: 200,
                body: JSON.stringify(expectedTestData),
            });

            expect(await cache.getCachedValue()).toEqual(expectedTestData);

            fetchMock.resetBehavior();
            fetchMock.get(TEST_FAKE_ENDPOINT, { status: 500 });
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
            fetchMock.get(TEST_FAKE_ENDPOINT, {
                status: 200,
                body: JSON.stringify(expectedTestData),
            });

            const cache = createTestCache();
            expect(await cache.getCachedValue()).toEqual(expectedTestData);

            fetchMock.resetBehavior();
            fetchMock.get(TEST_FAKE_ENDPOINT, { status: 500 });

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
            fetchMock.get(TEST_FAKE_ENDPOINT, {
                status: 200,
                body: JSON.stringify(expectedTestData),
            });

            expect(await cache.getCachedValue()).toEqual(expectedTestData);

            fetchMock.resetBehavior();
            fetchMock.get(TEST_FAKE_ENDPOINT, { status: 500 });

            // Invalidate and also clear the in-memory value.
            await cache.invalidate(true, true);
            // The server response fails and the backup fails, and the cache was invalidated such
            // that the previous in-memory values are cleared. We have no value to rely on, so we
            // expect the errorValue to be used here.
            expect(await cache.getCachedValue()).toEqual(cache.errorValue);
        });

        it("should wait until previous promises are resolved if refreshValue is true", async () => {
            reinitializeCommon({ ...testCommonConfig, useKeyValStorageForCachedAPIBackup: true });
            const cache = createTestCache();
            const firstTestData: ITestData = { a: "A string", b: -10, c: true, d: ["a", "c"] };
            const secondTestData: ITestData = { a: "Another", b: 55, c: false, d: ["d"] };
            let testDataSwitch = 0;
            fetchMock.get(TEST_FAKE_ENDPOINT, async () => {
                if (testDataSwitch === 0) {
                    await sleep(100);
                    return {
                        status: 200,
                        body: JSON.stringify(firstTestData),
                    };
                } else {
                    return {
                        status: 200,
                        body: JSON.stringify(secondTestData),
                    };
                }
            });

            const firstPromise = cache.getCachedValue();
            await sleep(50);
            testDataSwitch++;
            const secondPromise = cache.getCachedValue(true);
            await sleep(75);
            // After invalidating with refreshValue set to true, the backup should actually be
            // the second value
            const secondValue = await secondPromise;
            expect(secondValue).toStrictEqual(secondTestData);
            expect(JSON.parse(testKeyValStorage.get(cache.cacheBackupKey))).toStrictEqual(
                secondValue
            );
            expect(cache.value).toStrictEqual(secondValue);
            expect(cache.promise).not.toBeUndefined();
            // The initial promise should abort.
            expect(await firstPromise).toEqual(cache.errorValue);
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

            fetchMock.get(TEST_FAKE_ENDPOINT, async (): Promise<MockResponseObject> => {
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
            fetchMock.get(TEST_FAKE_ENDPOINT, async (): Promise<MockResponseObject> => {
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

            fetchMock.resetBehavior();
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

            fetchMock.resetBehavior();
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

        it("should survive race conditions", async () => {
            const expectedData: ITestData = { a: "Delayed", b: -3, c: false, d: ["Hello"] };
            mockSuccessGetWithDelayedResponse(expectedData, 50);

            const cache = createTestCache();
            // Trigger a caller to begin the cache refresh. This makes the promise not undefined.
            // Subsequent callers should be using that initial promise and using its resolved value.
            const initialPromise = cache.getCachedValue();
            await sleep(5);
            const useCache = cache.useCacheHook();

            const renderHookResult = renderHook(() => useCache());
            expect(renderHookResult.result.current).toBe(cache.loadingValue);
            await renderHookResult.waitForNextUpdate();
            expect(renderHookResult.result.current).toStrictEqual(expectedData);
            // The resolved value from the hook should be the exact same object reference as the
            // initial promise.
            expect(renderHookResult.result.current).toBe(await initialPromise);
            renderHookResult.unmount();
        });
    });
});
