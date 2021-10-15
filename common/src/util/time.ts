export enum Time {
    MINUTES,
    SECONDS,
    MILLIS,
}

export function convertSecondsTo(seconds: number, to: Time): number {
    switch (to) {
        case Time.MINUTES:
            return seconds / 60;
        case Time.MILLIS:
            return seconds * 1000;
        default:
            return seconds;
    }
}

export function convertMillisTo(millis: number, to: Time): number {
    switch (to) {
        case Time.MINUTES:
            return millis / 60000;
        case Time.SECONDS:
            return millis / 1000;
        default:
            return millis;
    }
}

export function convertMinutesTo(minutes: number, to: Time): number {
    switch (to) {
        case Time.SECONDS:
            return minutes * 60;
        case Time.MILLIS:
            return minutes * 60000;
        default:
            return minutes;
    }
}
