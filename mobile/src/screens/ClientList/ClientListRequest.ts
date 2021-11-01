import {
    apiFetch,
    APILoadError,
    Endpoint,
    getCurrentUser,
    getZones,
    IClientSummary,
    SearchOption,
    riskLevels,
} from "@cbr/common";
import { dbType } from "../../util/watermelonDatabase";

export type ClientListRow = {
    id: string;
    full_name: string;
    zoneID: number;
    zone: string;
    HealthLevel: string;
    EducationLevel: string;
    SocialLevel: string;
    last_visit_date: number;
};

export const fetchClientsFromDB = async (
    searchOption,
    searchValue: string,
    allClientsMode: boolean,
    database: dbType
): Promise<ClientListRow[]> => {
    try {
        const urlParams = new URLSearchParams();
        console.log(`urlParma is ${urlParams}`);
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
        const responseRows: any = await database.get("clients").query();
        var resultRow = responseRows.map((responseRow: IClientSummary) => ({
            id: responseRow.id,
            full_name: responseRow.full_name,
            zoneID: responseRow.zone,
            zone: zones.get(responseRow.zone) ?? "",
            HealthLevel: riskLevels[responseRow.health_risk_level].color,
            EducationLevel: riskLevels[responseRow.educat_risk_level].color,
            SocialLevel: riskLevels[responseRow.social_risk_level].color,
            last_visit_date: responseRow.last_visit_date,
        }));

        return resultRow;
    } catch (e) {
        return [];
    }
};
