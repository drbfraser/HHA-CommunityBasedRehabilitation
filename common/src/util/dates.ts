export const timestampToDateObj = (timestamp: number) => {
    return new Date(timestamp * 1000);
};

// in format "2/27/2021" (depending on user's locale)
export const timestampToDate = (timestamp: number, locale?: string, timezone?: string) => {
    return timestampToDateObj(timestamp).toLocaleDateString(
        locale ? convertLocale(locale) : undefined, 
        timezone ? {timeZone: timezone} : undefined,
    );
};

// in format "Mar 27, 2021, 10:13 AM" (depending on user's locale)
export const timestampToDateTime = (timestamp: number) => {
    const date = timestampToDateObj(timestamp);

    return date.toLocaleString([], {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
};

// in format of "Fri 10:13 AM" (depending on user's locale)
export const timestampToWeekdayTime = (timestamp: number) => {
    const date = timestampToDateObj(timestamp);

    return date.toLocaleString([], {
        weekday: "short",
        hour: "numeric",
        minute: "2-digit",
    });
};

/**
 * @return A date formatting function depending on the `referenceTimestamp`'s distance to the
 * date right now. Either {@link timestampToWeekdayTime} ("Fri 10:13 AM") if less than 1 week ago,
 * otherwise {@link timestampToDate} ("2/27/2021"))
 * @param referenceTimestamp An optional timestamp to use for determining the date formatter used.
 */
export function getDateFormatterFromReference(
    referenceTimestamp?: number
): (timestamp: number) => string {
    const currentTimestamp = Date.now() / 1000;
    const timestampDiff = (referenceTimestamp ?? 0) - currentTimestamp;
    const oneWeek = 60 * 60 * 24 * 7;

    if (timestampDiff >= 0 && timestampDiff < oneWeek) {
        return timestampToWeekdayTime;
    } else {
        return timestampToDate;
    }
}

// TODO: the following two functions don't properly take time zones into account
export const timestampToFormDate = (timestamp: number, convertTimezone: boolean = false) => {
    const date = timestampToDateObj(timestamp);

    return !convertTimezone ? 
        date.toISOString().substring(0, 10) :
        new Date(Number(date) - Number(date.getTimezoneOffset() * 60000)).toISOString().substring(0, 10);
};

export const timestampFromFormDate = (formDate: string, convertTimezone: boolean = false) => {
    const date = new Date(formDate);

    return !convertTimezone ? 
        date.getTime() / 1000 :
        new Date(date.getTime() + date.getTimezoneOffset() * 60000).getTime() / 1000;
};

function convertLocale(locale: string) {
    return locale.replace('_', '-');
}