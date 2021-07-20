import { get as mockGet, MockResponseObject, reset as resetFetchMocks } from "fetch-mock";
import { Endpoint } from "../../../src/util/endpoints";
import { renderHook } from "@testing-library/react-hooks";
import { addValidTokens } from "../../testHelpers/authTokenHelpers";
import { fromNewCommonModule } from "../../testHelpers/testCommonConfiguration";
import { getZones, IZone, TZoneMap, useZones } from "../../../src/util/hooks/zones";
import { checkAuthHeader } from "../../testHelpers/mockServerHelpers";

const testZoneMap: TZoneMap = new Map<number, string>([
    [0, "Zone #1"],
    [1, "Zone #2"],
    [2, "Zone #3"],
    [3, "Zone #4"],
    [4, "Zone #5"],
]);

const mockGetWithDefaultZones = () => {
    mockGet(Endpoint.ZONES, async (url, request): Promise<MockResponseObject> => {
        const errorResponse: MockResponseObject | null = checkAuthHeader(request);
        if (errorResponse) {
            return errorResponse;
        }

        return {
            status: 200,
            body: JSON.stringify(
                Array.from(
                    testZoneMap,
                    ([id, zoneName]) =>
                        ({
                            id: id,
                            zone_name: zoneName,
                        } as IZone)
                )
            ),
        };
    });
};

beforeEach(async () => {
    resetFetchMocks();
    await addValidTokens();
});

describe("zones.ts", () => {
    describe("useZones", () => {
        it("should load data from the mocked fetch", async () => {
            mockGetWithDefaultZones();

            // TODO: Have a way to clear out the cache, because using Jest's isolateModules doesn't
            //  work well with testing these hooks with different local state.
            const renderHookResult = renderHook(() => useZones());
            // The loading value is an empty map.
            expect(renderHookResult.result.current.size).toBe(0);
            await renderHookResult.waitForNextUpdate();
            expect(renderHookResult.result.current.entries()).toEqual(testZoneMap.entries());
        });
    });

    describe("getZones", () => {
        it("should load data from the mocked fetch", async () => {
            mockGetWithDefaultZones();

            expect((await getZones()).entries()).toEqual(testZoneMap.entries());
        });

        it("should use an empty map if the server returns an error", async () => {
            mockGet(Endpoint.ZONES, { status: 500 });

            const freshGetZonesFn = await fromNewCommonModule(async () =>
                import("../../../src/util/hooks/zones").then((module) => {
                    return module.getZones;
                })
            );

            expect((await freshGetZonesFn()).size).toBe(0);
        });

        it("should not throw if the server returns different JSON schema", async () => {
            mockGet(Endpoint.ZONES, async (url, request): Promise<MockResponseObject> => {
                const errorResponse: MockResponseObject | null = checkAuthHeader(request);
                if (errorResponse) {
                    return errorResponse;
                }

                const badSchema = [
                    ["0", "Zone #1"],
                    ["1", "Zone #2"],
                    ["2", "Zone #3"],
                    ["3", "Zone #4"],
                    ["4", "Zone #5"],
                ];

                return {
                    status: 200,
                    body: JSON.stringify(badSchema),
                };
            });

            const freshGetZonesFn = await fromNewCommonModule(async () => {
                return import("../../../src/util/hooks/zones").then((module) => module.getZones);
            });

            // the resulting map only contains a mapping of undefined to undefined
            expect(Array.from(await freshGetZonesFn())).toEqual([[undefined, undefined]]);
        });
    });
});
