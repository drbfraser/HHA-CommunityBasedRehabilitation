import {
    apiFetch,
    APILoadError,
    Endpoint,
    getCurrentUser,
    getZones,
    IClientSummary,
    SearchOption,
    riskLevels,
    clientPrioritySort,
    useZones,
    SortOptions,
} from "@cbr/common";

export type ClientTest = {
    id: number;
    full_name: string;
    zoneID: number;
    zone: string;
    HealthLevel: string;
    EducationLevel: string;
    SocialLevel: string;
};

const sortby = (
    a: ClientTest,
    b: ClientTest,
    sortOption: string,
    sortDirection: string
): number => {
    const zones = useZones();
    const getValue = (sortOption: string, c: ClientTest): string | number => {
        if (sortOption == SortOptions.ID) {
            return c.id;
        } else if (sortOption == SortOptions.NAME) {
            return c.full_name;
        } else if (sortOption == SortOptions.ZONE) {
            const zoneString = zones.get(c.zoneID);
            if (typeof zoneString == "string") {
                return zoneString;
            } else {
                return "undefined";
            }
        } else if (sortOption == SortOptions.HEALTH) {
            return c.HealthLevel;
        } else if (sortOption == SortOptions.EDUCATION) {
            return c.EducationLevel;
        } else if (sortOption == SortOptions.SOCIAL) {
            return c.SocialLevel;
        }
        return "error";
    };

    const valueA = getValue(sortOption, a);
    const valueB = getValue(sortOption, b);

    if (valueA !== valueB) {
        if (sortDirection == "dec") {
            // sort risks descending
            if (valueA > valueB) {
                return 1;
            } else {
                return -1;
            }
        } else {
            if (valueA < valueB) {
                return 1;
            } else {
                return -1;
            }
        }
    }

    // if they have the same risk, sort by visit dates ascending (oldest first)
    return 0;
};

export const fetchClientsFromApi = async (
    searchOption,
    searchValue: string,
    allClientsMode: boolean,
    sortOption,
    sortDirection
): Promise<ClientTest[]> => {
    try {
        const urlParams = new URLSearchParams();
        if (searchOption === SearchOption.NAME) {
            searchOption = "full_name";
        }
        if (searchValue) {
            urlParams.append(searchOption.toLowerCase(), searchValue);
        }
        if (!allClientsMode) {
            const user = await getCurrentUser();
            if (user !== APILoadError) {
                urlParams.append("created_by_user", String(user.id));
            }
        }
        const myComparator = (a: ClientTest, b: ClientTest) => {
            console.log("?");
            return sortby(a, b, sortOption, sortDirection);
        };
        const zones = await getZones();
        const resp = await apiFetch(Endpoint.CLIENTS, "?" + urlParams.toString());
        const responseRows: IClientSummary[] = await resp.json();
        if (sortOption == "") {
            console.log("Normal");
            const resultRow = responseRows.map((responseRow: IClientSummary) => ({
                id: responseRow.id,
                full_name: responseRow.full_name,
                zoneID: responseRow.zone,
                zone: zones.get(responseRow.zone) ?? "",
                HealthLevel: riskLevels[responseRow.health_risk_level].color,
                EducationLevel: riskLevels[responseRow.educat_risk_level].color,
                SocialLevel: riskLevels[responseRow.social_risk_level].color,
            }));
            console.log(resultRow);
            return resultRow;
        } else {
            console.log("Sort");
            var resultRow = responseRows.map((responseRow: IClientSummary) => ({
                id: responseRow.id,
                full_name: responseRow.full_name,
                zoneID: responseRow.zone,
                zone: zones.get(responseRow.zone) ?? "",
                HealthLevel: riskLevels[responseRow.health_risk_level].color,
                EducationLevel: riskLevels[responseRow.educat_risk_level].color,
                SocialLevel: riskLevels[responseRow.social_risk_level].color,
            }));
            console.log(resultRow);
            resultRow = resultRow.sort(myComparator);
            console.log(resultRow);
            return resultRow;
        }
    } catch (e) {
        return [];
    }
};
