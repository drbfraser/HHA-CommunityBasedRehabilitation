import { countObjectKeys } from "../../src/util/objects";

describe("objects.ts", () => {
    describe("countObjectKeys", () => {
        it("should work on undefined", () => {
            expect(countObjectKeys(undefined)).toBe(0);
        });

        it("should count the number of keys", () => {
            const obj: Record<string, number> = {};
            for (let i = 0; i < 100; i++) {
                expect(countObjectKeys(obj)).toBe(Object.keys(obj).length);
                expect(countObjectKeys(obj)).toBe(i);
                obj[`${i}-key`] = i;
            }
        });

        it("should not count non-enumerable object keys", () => {
            const obj: Record<string, number> = {};
            Object.defineProperty(obj, "cantGetThis", { enumerable: false });
            Object.defineProperty(obj, "canGetThis", { enumerable: true });
            Object.defineProperty(obj, "canGetThisToo", { enumerable: true });

            expect(countObjectKeys(obj)).toBe(Object.keys(obj).length);
            expect(countObjectKeys(obj)).toBe(2);
        });
    });
});
