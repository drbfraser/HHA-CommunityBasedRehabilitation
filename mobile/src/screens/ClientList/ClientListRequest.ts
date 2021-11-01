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
import { Q } from "@nozbe/watermelondb";

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
        console.log(`allclient mode is ${allClientsMode}`);
        if (searchOption === SearchOption.NAME) {
            searchOption = "full_name";
        }
        if (searchValue) {
            console.log(`searchvalue is ${searchValue}`);
        }
        const zones = await getZones();
        let responseRows: any;
        if (!allClientsMode) {
            const user = await getCurrentUser();
            if (user !== APILoadError) {
                responseRows = await database
                    .get("clients")
                    .query(Q.where("user_id", user.id))
                    .fetch();
            }
        } else {
            responseRows = await database.get("clients").query();
        }

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
