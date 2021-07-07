import { get as mockGet, MockResponseObject, reset as resetFetchMocks } from "fetch-mock";
import { Endpoint } from "../../../src/util/endpoints";
import { renderHook } from "@testing-library/react-hooks";
import {
    getDisabilities,
    getOtherDisabilityId,
    IDisability,
    TDisabilityMap,
    useDisabilities,
} from "../../../src/util/hooks/disabilities";
import { addValidTokens } from "../../testHelpers/authTokenHelpers";
import { fromNewCommonModule } from "../../testHelpers/testCommonConfiguration";
import { checkAuthHeader } from "../../testHelpers/mockServerHelpers";

const ID_OF_OTHER_IN_TEST_DISABILITY_MAP = 4;

const testDisabilityMap: TDisabilityMap = new Map<number, string>([
    [0, "disability #1"],
    [1, "disability #2"],
    [2, "disability #3"],
    [ID_OF_OTHER_IN_TEST_DISABILITY_MAP, "Other"],
    [5, "disability #4"],
]);

const mockGetWithDefaultTestDisabilityMap = () => {
    mockGet(Endpoint.DISABILITIES, async (url, request): Promise<MockResponseObject> => {
        const errorResponse = checkAuthHeader(request);
        if (errorResponse) {
            return errorResponse;
        }

        return {
            status: 200,
            body: JSON.stringify(
                Array.from(
                    testDisabilityMap,
                    ([id, disability]) =>
                        ({
                            id: id,
                            disability_type: disability,
                        } as IDisability)
                )
            ),
        };
    });
};

beforeEach(async () => {
    resetFetchMocks();
    await addValidTokens();
});

describe("disabilities.ts", () => {
    describe("useDisabilities", () => {
        it("should load data from the mocked fetch", async () => {
            mockGetWithDefaultTestDisabilityMap();

            // TODO: Have a way to clear out the cache, because using Jest's isolateModules doesn't
            //  work well with testing these hooks with different local state.
            const renderHookResult = renderHook(() => useDisabilities());
            // The loading value is an empty map.
            expect(renderHookResult.result.current.size).toBe(0);
            await renderHookResult.waitForNextUpdate();
            expect(renderHookResult.result.current.entries()).toEqual(testDisabilityMap.entries());
        });
    });

    describe("getDisabilities", () => {
        it("should load data from the mocked fetch", async () => {
            mockGetWithDefaultTestDisabilityMap();

            expect((await getDisabilities()).entries()).toEqual(testDisabilityMap.entries());
        });

        it("should use an empty map if the server returns an error", async () => {
            mockGet(Endpoint.DISABILITIES, { status: 500 });

            const freshGetDisabilitiesFn = await fromNewCommonModule(async () => {
                return import("../../../src/util/hooks/disabilities").then(
                    (module) => module.getDisabilities
                );
            });

            expect((await freshGetDisabilitiesFn()).size).toBe(0);
        });
    });

    describe("getOtherDisabilityId", () => {
        it("should be able to find the 'Other' disability from server if it exists", async () => {
            mockGetWithDefaultTestDisabilityMap();

            const disabilities = await getDisabilities();
            expect(getOtherDisabilityId(disabilities)).toEqual(ID_OF_OTHER_IN_TEST_DISABILITY_MAP);
        });

        it("should be able to find 'Other' disability in various cases", async () => {
            const disabilities: TDisabilityMap = new Map([
                [0, "Other"],
                [1, "disability #2"],
                [2, "disability #3"],
                [3, "disability #4"],
            ]);
            expect(getOtherDisabilityId(disabilities)).toEqual(0);

            const anotherMap: TDisabilityMap = new Map([
                [0, "Not other"],
                [1, "disability #2"],
                [2, "disability #3"],
                [3, "Other"],
            ]);
            expect(getOtherDisabilityId(anotherMap)).toEqual(3);

            const yetAnotherMap: TDisabilityMap = new Map([
                [0, "Not other"],
                [1, "disability #2"],
                [2, "Other"],
                [3, "disability #3"],
            ]);
            expect(getOtherDisabilityId(yetAnotherMap)).toEqual(2);

            const containsOnlyOther: TDisabilityMap = new Map([[500, "Other"]]);
            expect(getOtherDisabilityId(containsOnlyOther)).toEqual(500);
        });

        it("returns 0 if unable to find the 'Other' disability", async () => {
            const disabilities: TDisabilityMap = new Map<number, string>([
                [0, "disability #1"],
                [1, "disability #2"],
                [2, "disability #3"],
                [3, "disability #4"],
            ]);
            expect(getOtherDisabilityId(disabilities)).toEqual(0);

            const emptyDisabilities: TDisabilityMap = new Map<number, string>();
            expect(getOtherDisabilityId(emptyDisabilities)).toEqual(0);
        });
    });
});
