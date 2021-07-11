import { apiFetch, APILoadError, Endpoint, getCurrentUser, getZones } from "@cbr/common";
import { IClientSummary } from "@cbr/common";
import { riskLevels } from "@cbr/common";
import { SearchOption } from "./searchOptions";
export type ClientTest = {
    id: number;
    full_name: string;
    zone: string;
    HealthLevel: string;
    EducationLevel: string;
    SocialLevel: string;
};

export const fetchClientsFromApi = async (
    searchOption,
    searchValue: string,
    allClientsMode: boolean
): 
Promise<ClientTest[]> => {
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
        const resultRow = responseRows.map((responseRow: IClientSummary) => ({
            id: responseRow.id,
            full_name: responseRow.full_name,
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
