import fetchMock, { MockResponseObject } from "fetch-mock";
import { APILoadError, Endpoint, TAPILoadError } from "../../../src/util/endpoints";
import { renderHook } from "@testing-library/react-hooks";
import { addValidTokens } from "../../testHelpers/authTokenHelpers";
import { fromNewCommonModule } from "../../testHelpers/testCommonConfiguration";
import { checkAuthHeader } from "../../testHelpers/mockServerHelpers";
import { IUser, UserRole } from "../../../src/util/users";
import { getCurrentUser, useCurrentUser } from "../../../src/util/hooks/currentUser";
import { invalidateAllCachedAPIInternal } from "../../../src/util/hooks/cachedAPI";

const testUser: IUser = {
    id: "1",
    username: "user",
    first_name: "John",
    last_name: "",
    role: UserRole.WORKER,
    is_active: true,
    phone_number: "0000000000",
    zone: 0,
};

const mockGetWithDefaultUser = () => {
    fetchMock.get(Endpoint.USER_CURRENT, async (url, request): Promise<MockResponseObject> => {
        const errorResponse: MockResponseObject | null = checkAuthHeader(request);
        if (errorResponse) {
            return errorResponse;
        }

        return {
            status: 200,
            body: JSON.stringify(testUser),
        };
    });
};

beforeEach(async () => {
    await invalidateAllCachedAPIInternal(true, true, false, false);
    fetchMock.reset();
    await addValidTokens();
});

describe("currentUser.ts", () => {
    describe("useCurrentUser", () => {
        it("should load data from the mocked fetch", async () => {
            mockGetWithDefaultUser();

            // TODO: Have a way to clear out the cache, because using Jest's isolateModules doesn't
            //  work well with testing these hooks with different local state.
            const renderHookResult = renderHook(() => useCurrentUser());
            expect(renderHookResult.result.current).toBeUndefined();
            await renderHookResult.waitForNextUpdate();
            expect(renderHookResult.result.current).toEqual(testUser);
        });
    });

    describe("getCurrentUser", () => {
        it("should load data from the mocked fetch", async () => {
            mockGetWithDefaultUser();

            expect(await getCurrentUser()).toEqual(testUser);
        });

        it("should refetch if refresh is true", async () => {
            mockGetWithDefaultUser();
            expect(await getCurrentUser(false)).toEqual(testUser);
            expect(fetchMock.calls().length).toBe(1);
            expect(await getCurrentUser(false)).toEqual(testUser);
            expect(fetchMock.calls().length).toBe(1);
            expect(await getCurrentUser(true)).toEqual(testUser);
            expect(fetchMock.calls().length).toBe(2);
        });

        it("should use APILoadError if the server returns an error", async () => {
            fetchMock.get(Endpoint.USER_CURRENT, { status: 500 });

            const freshGetCurrentUserFn = await fromNewCommonModule(async () =>
                import("../../../src/util/hooks/currentUser").then(
                    (module) => module.getCurrentUser
                )
            );

            expect(await freshGetCurrentUserFn()).toBe(APILoadError);
        });

        const testCurrentUserEndpointReturningResponse = async (
            responseFromServer: any
        ): Promise<IUser> => {
            fetchMock.get(Endpoint.USER_CURRENT, async (url, request): Promise<MockResponseObject> => {
                const errorResponse: MockResponseObject | null = checkAuthHeader(request);
                if (errorResponse) {
                    return errorResponse;
                }

                return {
                    status: 200,
                    body: JSON.stringify(responseFromServer),
                };
            });

            const freshGetCurrentUserFn = await fromNewCommonModule(async () =>
                import("../../../src/util/hooks/currentUser").then(
                    (module) => module.getCurrentUser
                )
            );

            const userFromMockServer: IUser | TAPILoadError = await freshGetCurrentUserFn();
            // loosely typed
            expect(userFromMockServer).toEqual(responseFromServer);

            return userFromMockServer as IUser;
        };

        it("should not throw if the server returns entirely different JSON schema", async () => {
            const userFromMockServer = await testCurrentUserEndpointReturningResponse({
                javaScript: "asd",
                somethingElse:
                    "JavaScript is loosely typed and this won't cause errors until property is accessed",
            });
            expect(userFromMockServer).not.toMatchObject<IUser>(testUser);
            // will throw later if some code later assumes it's IUser, but this shouldn't happen
            expect(userFromMockServer.id).toBeUndefined();
            expect(userFromMockServer.username).toBeUndefined();
        });

        it("should not throw if the server returns expected JSON schema with extras", async () => {
            const userFromMockServer = await testCurrentUserEndpointReturningResponse({
                ...testUser,
                someAddedProperty: 5,
            } as IUser & { someAddedProperty: number });
            // this only matches a subset of testUser's properties, which is expected
            expect(userFromMockServer).toMatchObject<IUser>(testUser);
            expect(userFromMockServer.hasOwnProperty("someAddedProperty")).toBeTruthy();
        });
    });
});
