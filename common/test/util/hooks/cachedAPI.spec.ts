import { get as mockGet, MockResponseObject, reset as resetFetchMocks } from "fetch-mock";
import { cachedAPIGet, cachedAPIHook, IAPICacheData } from "../../../src/util/hooks/cachedAPI";
import { apiFetch, Endpoint } from "../../../src/util/endpoints";
import { addValidTokens } from "../../testHelpers/authTokenHelpers";
import { renderHook } from "@testing-library/react-hooks";
import { sleep } from "../../testHelpers/sleep";

beforeEach(async () => {
    resetFetchMocks();
    await addValidTokens();
});

interface ITestData {
    a: string;
    b: number;
    c: boolean;
    d: string[];
}

const TEST_FAKE_ENDPOINT = "fakeEndpoint" as Endpoint;

const TEST_ERROR_VALUE = "error";

const TEST_LOADING_VALUE = "loading";

const createTestCache = () => {
    return {
        doFetch: () => apiFetch(TEST_FAKE_ENDPOINT),
        transformData: (data: ITestData) => data,
        errorValue: TEST_ERROR_VALUE,
        loadingValue: TEST_LOADING_VALUE,
        promise: undefined,
        value: undefined,
    } as IAPICacheData<ITestData, string, string>;
};

describe("cachedAPI.ts", () => {
    describe("cachedAPIGet", () => {
        it("should load if server returns ok response", async () => {
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

            expect(await cachedAPIGet(createTestCache())).toEqual(expectedTestData);
        });

        it("should give error value if server returns error", async () => {
            mockGet(TEST_FAKE_ENDPOINT, { status: 500 });
            expect(await cachedAPIGet(createTestCache())).toBe(TEST_ERROR_VALUE);
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

            const value: ITestData | string = await cachedAPIGet(createTestCache());
            expect(typeof value).not.toBe("string");
            expect(value).toEqual(wrongInterfaceData);
        });
    });

    describe("cachedAPIHook", () => {
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
            const useCache = cachedAPIHook(cache);
            const renderHookResult = renderHook(() => useCache());
            expect(renderHookResult.result.current).toEqual(TEST_LOADING_VALUE);
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
            const useCache = cachedAPIHook(cache);
            const renderHookResult = renderHook(() => useCache());
            expect(renderHookResult.result.current).toEqual(TEST_LOADING_VALUE);
            await renderHookResult.waitForNextUpdate();
            expect(renderHookResult.result.current).toEqual(TEST_ERROR_VALUE);
            renderHookResult.unmount();
            expect(cache.promise).toBeUndefined();
            expect(cache.value).toBeUndefined();
        });
    });
});
