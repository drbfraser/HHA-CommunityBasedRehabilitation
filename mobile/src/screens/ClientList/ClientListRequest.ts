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
import { modelName, tableKey } from "../../models/constant";

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
        const zones = await getZones();
        let responseRows: any;
        const clientCollection = database.get(modelName.clients);

        if (searchOption === SearchOption.NAME) {
            searchOption = "full_name";
        }

        if (!allClientsMode) {
            const user = await getCurrentUser();
            if (user !== APILoadError) {
                if (searchOption !== "") {
                    if (searchOption === "full_name") {
                        responseRows = await clientCollection
                            .query(
                                Q.where(tableKey.user_id, user.id),
                                Q.where(searchOption, Q.like(`%${searchValue}%`))
                            )
                            .fetch();
                    } else {
                        responseRows = await clientCollection
                            .query(
                                Q.where(tableKey.user_id, user.id),
                                Q.where(searchOption, searchValue)
                            )
                            .fetch();
                    }
                } else {
                    responseRows = await clientCollection
                        .query(Q.where(tableKey.user_id, user.id))
                        .fetch();
                }
            }
        } else {
            if (searchOption !== "") {
                if (searchOption === "full_name") {
                    responseRows = await clientCollection
                        .query(Q.where(searchOption, Q.like(`%${searchValue}%`)))
                        .fetch();
                } else {
                    responseRows = await clientCollection
                        .query(Q.where(searchOption, searchValue))
                        .fetch();
                }
            } else {
                responseRows = await clientCollection.query();
            }
        }
        var resultRow = responseRows.map((responseRow: IClientSummary) => ({
            id: responseRow.id,
            full_name: responseRow.full_name,
            zoneID: responseRow.zone,
            zone: zones.get(responseRow.zone) ?? "",
            HealthLevel: riskLevels[responseRow.health_risk_level].color,
            EducationLevel: riskLevels[responseRow.educat_risk_level].color,
            SocialLevel: riskLevels[responseRow.social_risk_level].color,
            NutritionLevel: riskLevels[responseRow.nutrit_risk_level].color,
            last_visit_date: responseRow.last_visit_date,
        }));

        return resultRow;
    } catch (e) {
        return [];
    }
};
