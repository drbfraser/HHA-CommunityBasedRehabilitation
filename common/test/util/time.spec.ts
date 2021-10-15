import { convertSecondsTo, convertMillisTo, convertMinutesTo, Time } from "../../src/util/time";

const testDate: number = new Date("December 15, 1995 03:25:10:05").getTime();
const testDateInMillis: number = testDate;
const testDateInSeconds: number = testDate / 1000;
const testDateInMinutes: number = testDate / 60000;

describe("time.ts", () => {
    describe("convertMillisTo", () => {
        it("should return correct conversion of milliseconds to minutes & seconds", () => {
            const dateInMinutes = convertMillisTo(testDateInMillis, Time.MINUTES);
            const dateInSeconds = convertMillisTo(testDateInMillis, Time.SECONDS);

            expect(dateInMinutes).toBe(testDateInMinutes);
            expect(dateInSeconds).toBe(testDateInSeconds);
        });
    });

    describe("convertSecondsTo", () => {
        it("should return correct conversion of seconds to minutes & milliseconds", () => {
            const dateInMinutes = convertSecondsTo(testDateInSeconds, Time.MINUTES);
            const dateInMillis = convertSecondsTo(testDateInSeconds, Time.MILLIS);

            expect(dateInMinutes).toBe(testDateInMinutes);
            expect(dateInMillis).toBe(testDateInMillis);
        });
    });

    describe("convertMinutesTo", () => {
        it("should return correct conversion of minutes to seconds & milliseconds", () => {
            const dateInSeconds = convertMinutesTo(testDateInMinutes, Time.SECONDS);
            const dateInMillis = convertMinutesTo(testDateInMinutes, Time.MILLIS);

            expect(dateInSeconds).toBe(testDateInSeconds);
            expect(dateInMillis).toBe(testDateInMillis);
        });
    });
});
