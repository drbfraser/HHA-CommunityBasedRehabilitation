export const timestampToDateObj = (timestamp: number) => {
    return new Date(timestamp * 1000);
};

// in format "2/27/2021" (depending on user's locale)
export const timestampToDate = (timestamp: number) => {
    return timestampToDateObj(timestamp).toLocaleDateString();
};

// in format "2/27/2021 10:13:12 AM" (depending on user's locale)
export const timestampToDateTime = (timestamp: number) => {
    return timestampToDateObj(timestamp).toLocaleString();
};

// in format of "Fri 10:13 AM" (depending on user's locale)
export const timestampToWeekdayTime = (timestamp: number) => {
    const date = timestampToDateObj(timestamp);

    return date.toLocaleString([], {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
    });
};

// change date format depending on a reference timestamp
// either "Fri 10:13 AM" if less than 1 week ago else "2/27/2021"
export const timestampToDateFromReference = (referenceTimestamp?: number) => {
    const currentTimestamp = Date.now() / 1000;
    const timestampDiff = (referenceTimestamp ?? 0) - currentTimestamp;
    const oneWeek = 60 * 60 * 24 * 7;

    if (timestampDiff >= 0 && timestampDiff < oneWeek) {
        return timestampToWeekdayTime;
    } else {
        return timestampToDate;
    }
};

export const timestampToFormDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toISOString().substring(0, 10)
}

export const timestampFromFormDate = (formDate: string) => {
    return new Date(formDate).getTime() / 1000
}
