import {
    APILoadError,
    ClientField,
    getCurrentUser,
    getZones,
    IClientSummary,
    riskLevels,
    SearchOption,
} from "@cbr/common";
import { Q } from "@nozbe/watermelondb";
import { modelName, tableKey } from "../../models/constant";
import { dbType } from "../../util/watermelonDatabase";

export type ClientListRow = {
    id: string;
    full_name: string;
    zoneID: number;
    zone: string;
    HealthLevel: string;
    EducationLevel: string;
    SocialLevel: string;
    NutritionLevel: string;
    MentalLevel: string;
    last_visit_date: number;
    is_active: boolean;
};

export const fetchClientsFromDB = async (
    searchOption,
    searchValue: string,
    allClientsMode: boolean,
    archivedMode: boolean,
    database: dbType
): Promise<ClientListRow[]> => {
    try {
        const zones = await getZones();
        const clientCollection = database.get(modelName.clients);
        let query: any = clientCollection.query();

        if (archivedMode === false) {
            query = query.extend(Q.where(ClientField.is_active, true));
        }

        if (searchOption === SearchOption.NAME || searchValue === "") {
            searchOption = "full_name";
        }

        if (!allClientsMode) {
            const user = await getCurrentUser();
            if (user !== APILoadError) {
                if (searchOption !== "") {
                    if (searchOption === "full_name") {
                        query = query.extend(
                            Q.where(tableKey.user_id, user.id),
                            Q.where(searchOption, Q.like(`%${searchValue}%`))
                        );
                    } else {
                        query = query.extend(
                            Q.where(tableKey.user_id, user.id),
                            Q.where(searchOption, searchValue)
                        );
                    }
                } else {
                    query = query.extend(Q.where(tableKey.user_id, user.id));
                }
            }
        } else {
            if (searchOption !== "") {
                if (searchOption === "full_name") {
                    query = query.extend(Q.where(searchOption, Q.like(`%${searchValue}%`)));
                } else {
                    query = query.extend(Q.where(searchOption, searchValue));
                }
            }
        }
        const results = await query.fetch();
        var resultRow: Array<ClientListRow> = results.map((responseRow: IClientSummary) => ({
            id: responseRow.id,
            full_name: responseRow.full_name,
            zoneID: responseRow.zone,
            zone: zones.get(responseRow.zone) ?? "",
            HealthLevel: riskLevels[responseRow.health_risk_level].color,
            EducationLevel: riskLevels[responseRow.educat_risk_level].color,
            NutritionLevel: riskLevels[responseRow.nutrit_risk_level].color,
            SocialLevel: riskLevels[responseRow.social_risk_level].color,
            MentalLevel: riskLevels[responseRow.mental_risk_level].color,
            last_visit_date: responseRow.last_visit_date,
            is_active: responseRow.is_active,
        }));

        return resultRow;
    } catch (e) {
        return [];
    }
};
