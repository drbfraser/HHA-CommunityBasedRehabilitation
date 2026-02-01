import {
    getDateFormatterFromReference,
    timestampToDate,
    timestampToFormDate,
    timestampToWeekdayTime,
} from "../../src/util/dates";

// note: we don't test individual formatting functions due to timezone differences
// obviously we can change the timezone for CI, but for running tests on developer machines,
// some tests might fail
describe("dates.ts", () => {
    describe("timestampToDateFromReference", () => {
        it("should select correct date formatter", () => {
            const secondsInOneWeek = 60 * 60 * 24 * 7;
            const timestampNow = Date.now() / 1000;

            // note: checking functions
            const moreThanOneWeekBefore = timestampNow - secondsInOneWeek - 5;
            expect(getDateFormatterFromReference(moreThanOneWeekBefore)).toBe(timestampToDate);

            const bitLessThanOneWeekBefore = timestampNow - secondsInOneWeek + 5;
            expect(getDateFormatterFromReference(bitLessThanOneWeekBefore)).toBe(timestampToDate);

            const closeToNow = timestampNow + 1;
            expect(getDateFormatterFromReference(closeToNow)).toBe(timestampToWeekdayTime);

            const bitLessThanOneWeekAgo = timestampNow + secondsInOneWeek - 5;
            expect(getDateFormatterFromReference(bitLessThanOneWeekAgo)).toBe(
                timestampToWeekdayTime
            );

            const bitOverOneWeekAgo = timestampNow + secondsInOneWeek + 5;
            expect(getDateFormatterFromReference(bitOverOneWeekAgo)).toBe(timestampToDate);

            const wayMoreThanOneWeekAgo = 2 * timestampNow;
            expect(getDateFormatterFromReference(wayMoreThanOneWeekAgo)).toBe(timestampToDate);
        });
    });

    describe("timestampToFormDate", () => {
        it("should format correctly", () => {
            // note: these are all based on UTC date, so we can just test it without
            // worrying about timezone of the computer running the tests
            expect(timestampToFormDate(0)).toBe("1970-01-01");
            expect(timestampToFormDate(1111111111000)).toBe("2005-03-18");
            expect(timestampToFormDate(1611111111000)).toBe("2021-01-20");
            // leap year
            expect(timestampToFormDate(1709218988000)).toBe("2024-02-29");
        });
    });
});
