import { get as mockGet, reset as resetFetchMocks } from "fetch-mock";
import { apiFetch, APIFetchFailError, Endpoint } from "../../src/util/endpoints";
import { addValidTokens } from "../testHelpers/authTokenHelpers";
import buildFormErrorInternal from "../../src/util/internal/buildFormError";
import { reinitializeCommon } from "../../src/init";
import { testCommonConfig } from "../testHelpers/testCommonConfiguration";

beforeEach(async () => {
    resetFetchMocks();
    await addValidTokens();
});

describe("endpoints.ts", () => {
    describe("apiFetch", () => {
        it("should reject with APIFetchFailError on HTTP errors", async () => {
            const expectedErrorMessage = "No active account found with the given credentials";
            mockGet(Endpoint.LOGIN, {
                status: 401,
                body: JSON.stringify({
                    detail: expectedErrorMessage,
                }),
            });

            try {
                await apiFetch(Endpoint.LOGIN);
                expect(false).toBe("Expected to throw an error");
            } catch (e) {
                if (!APIFetchFailError.isFetchError(e)) {
                    expect(false).toBe(`wrong exception type: got ${JSON.stringify(e)}`);
                }
                const fetchError = e as APIFetchFailError;
                expect(fetchError.status).toBe(401);
                expect(fetchError.details).toEqual(expectedErrorMessage);
            }
        });

        it("should wrap errors if configured to do so", async () => {
            const EXPECTED_ERROR_MESSAGE = "EXPECTED ERROR MESSAGE";

            reinitializeCommon({
                ...testCommonConfig,
                fetchErrorWrapper: async (e: Error) => {
                    return new Error(EXPECTED_ERROR_MESSAGE);
                },
            });

            mockGet(Endpoint.LOGIN, () => {
                // simulate a network error from the fetch call
                throw new TypeError("Network request failed");
            });

            try {
                await apiFetch(Endpoint.LOGIN);
                expect(false).toBe("Expected to throw an error");
            } catch (e) {
                expect(e).toBeInstanceOf(Error);
                expect((e as Error).message).toBe(EXPECTED_ERROR_MESSAGE);
            }
        });
    });

    describe("APIFetchFailError", () => {
        describe("buildFormError", () => {
            it("should aggregate form errors", () => {
                const formLabels: Record<string, string> = {
                    usrnm: "Username",
                    pass: "Password",
                };

                const error = new APIFetchFailError("Test message", 401, {
                    usrnm: "Username doesn't exist",
                    pass: "Password too weak",
                });

                expect(buildFormErrorInternal(error, formLabels)).toBe(
                    "Username: Username doesn't exist\nPassword: Password too weak"
                );

                // not passing in the form labels results in the raw fields being used
                expect(buildFormErrorInternal(error, {})).toBe(
                    "usrnm: Username doesn't exist\npass: Password too weak"
                );
                expect(buildFormErrorInternal(error, undefined)).toBe(
                    "usrnm: Username doesn't exist\npass: Password too weak"
                );
            });
        });
    });
});
