import { Validation } from "../../src/util/validations";

describe("validations.ts", () => {
    describe("passwordRegExp", () => {
        it("should match valid passwords", () => {
            expect("Password123").toMatch(Validation.passwordRegExp);
            expect("hhaLogin123").toMatch(Validation.passwordRegExp);
            expect("Battery horse car staple 1").toMatch(Validation.passwordRegExp);
            expect("ABC.D.E.FGHI*J/KL-M+NO*PQ RnSTUVWXYZ9").toMatch(Validation.passwordRegExp);
            expect("ó¥[¾.1vs,£ÆN<½MzP²WkgwµG!üÁ8ü}F>}Ë¬ä_ªÒI¨Ymÿ÷E¦Ø=EW¦xêª4").toMatch(
                Validation.passwordRegExp
            );
        });
        it("should not match invalid passwords", () => {
            expect("").not.toMatch(Validation.passwordRegExp);
            expect("1A3").not.toMatch(Validation.passwordRegExp);
            expect("1A34").not.toMatch(Validation.passwordRegExp);
            expect("1A345").not.toMatch(Validation.passwordRegExp);
            expect("1A3456").not.toMatch(Validation.passwordRegExp);
            expect("1A34567").not.toMatch(Validation.passwordRegExp);
            expect("hunter2").not.toMatch(Validation.passwordRegExp);
            expect("Password").not.toMatch(Validation.passwordRegExp);
            expect("hhaLogin").not.toMatch(Validation.passwordRegExp);
            expect("ba").not.toMatch(Validation.passwordRegExp);
            expect("*").not.toMatch(Validation.passwordRegExp);
            expect("P²WkgwµGkgwµkgwµ@!!!@!#@#@$%").not.toMatch(Validation.passwordRegExp);
        });
    });

    describe("usernameRegExp", () => {
        it("should match valid usernames", () => {
            expect("venus").toMatch(Validation.usernameRegExp);
            expect("venus123432423").toMatch(Validation.usernameRegExp);
            expect("venus@venus.com").toMatch(Validation.usernameRegExp);
            expect("GeT_NiGhT").toMatch(Validation.usernameRegExp);
            expect("abcdefghijklmnopqrstuvwxyz0123456789").toMatch(Validation.usernameRegExp);
            expect("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789").toMatch(Validation.usernameRegExp);
        });
        it("should not match invalid usernames", () => {
            expect(":<>").not.toMatch(Validation.usernameRegExp);
            expect(":(").not.toMatch(Validation.usernameRegExp);
            expect("DROP TABLE user;").not.toMatch(Validation.usernameRegExp);
        });
    });
});
