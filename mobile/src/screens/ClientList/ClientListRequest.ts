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
    themeColors,
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
        const zones = await getZones();
        const resp = await apiFetch(Endpoint.CLIENTS, "?" + urlParams.toString());
        const responseRows: IClientSummary[] = await resp.json();
        var resultRow = responseRows.map((responseRow: IClientSummary) => ({
            id: responseRow.id,
            full_name: responseRow.full_name,
            zoneID: responseRow.zone,
            zone: zones.get(responseRow.zone) ?? "",
            HealthLevel: riskLevels[responseRow.health_risk_level].color,
            EducationLevel: riskLevels[responseRow.educat_risk_level].color,
            SocialLevel: riskLevels[responseRow.social_risk_level].color,
        }));

        return resultRow;
    } catch (e) {
        return [];
    }
};
