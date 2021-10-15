import { convertSecondsTo, convertMillisTo, convertMinutesTo, Time } from "./time";

export const timestampToDateObj = (timestamp: number) => {
    return new Date(convertSecondsTo(timestamp, Time.MILLIS));
};

// in format "2/27/2021" (depending on user's locale)
export const timestampToDate = (timestamp: number, locale?: string, timezone?: string) => {
    return locale && timezone
        ? /* Stored timestamps are in GMT. Ie. When we set a date 25/10/1990, it's saved to 
        the backend as 25/10/1990 00:00:00 GMT. When we convert it back to the client side,
        depending on the timezone & locale, we may actually get back 24/10/1990. 
        
        This directly converts 25/10/1990 00:00:00 GMT to 25/10/1990 00:00:00 <user_timezone>
        and in the properly accepted format of the client locale. */
          timestampToDateObj(
              timestamp + convertMinutesTo(new Date(timestamp).getTimezoneOffset(), Time.SECONDS)
          ).toLocaleDateString(convertLocale(locale), { timeZone: timezone })
        : timestampToDateObj(timestamp).toLocaleDateString();
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
    const currentTimestamp = convertMillisTo(Date.now(), Time.SECONDS);
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

    return convertTimezone
        ? new Date(Number(date) + Number(convertMinutesTo(date.getTimezoneOffset(), Time.MILLIS)))
              .toISOString()
              .substring(0, 10)
        : date.toISOString().substring(0, 10);
};

export const timestampFromFormDate = (formDate: string, convertTimezone: boolean = false) => {
    const date = new Date(formDate);
    const timeInMillis = convertTimezone
        ? new Date(
              date.getTime() + convertMinutesTo(date.getTimezoneOffset(), Time.MILLIS)
          ).getTime()
        : date.getTime();

    return convertMillisTo(timeInMillis, Time.SECONDS);
};

function convertLocale(locale: string) {
    return locale.replace("_", "-");
}
