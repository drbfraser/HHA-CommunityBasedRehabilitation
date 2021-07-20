import { getRandomStr } from "../../src/util/misc";

describe("misc.ts", () => {
    describe("getRandomStr", () => {
        it("should return strings of specified length", () => {
            expect(getRandomStr(-1).length).toBe(0);

            for (let len = 0; len < 1500; len++) {
                expect(getRandomStr(len).length).toBe(len);
            }
        });
    });
});
