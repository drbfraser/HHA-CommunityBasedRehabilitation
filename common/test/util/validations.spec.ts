import { Validation } from "../../src/util/validations";

describe("validations.ts", () => {
    describe("passwordRegExp", () => {
        it("should match valid passwords", () => {
            expect("Password123").toMatch(Validation.passwordRegExp);
        });
    });
});
