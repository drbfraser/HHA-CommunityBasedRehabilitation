import {
    apiFetch,
    clientPrioritySort,
    Endpoint,
    getZones,
    IOutstandingReferral,
} from "@cbr/common";
import { IClientSummary } from "@cbr/common";
import { riskLevels } from "@cbr/common";
import { dbType } from "../../util/watermelonDatabase";
import { ClientListRow } from "../ClientList/ClientListRequest";

export type BriefReferral = {
    id: number;
    client_id: number;
    full_name: string;
    type: string;
    date_referred: number;
};

const concatenateReferralType = (row: IOutstandingReferral) => {
    let referralTypes: any[] = [];
    if (row.wheelchair) referralTypes.push("Wheelchair");
    if (row.physiotherapy) referralTypes.push("Physiotherapy");
    if (row.orthotic) referralTypes.push("Orthotic");
    if (row.prosthetic) referralTypes.push("Prosthetic");
    if (row.services_other) referralTypes.push(row.services_other);

    return referralTypes.join(", ");
};

export const fetchAllClientsFromDB = async (database: dbType): Promise<ClientListRow[]> => {
    try {
        const zones = await getZones();
        const tempClients: any = await database.get("clients").query();
        const resultRows = tempClients
            .sort(clientPrioritySort)
            .slice(0, 5)
            .map((responseRow: IClientSummary) => ({
                id: responseRow.id,
                full_name: responseRow.full_name,
                zone: zones.get(responseRow.zone) ?? "",
                HealthLevel: riskLevels[responseRow.health_risk_level].color,
                EducationLevel: riskLevels[responseRow.educat_risk_level].color,
                SocialLevel: riskLevels[responseRow.social_risk_level].color,
                last_visit_date: responseRow.last_visit_date,
            }));
        return resultRows;
    } catch (e) {
        return [];
    }
};
export const fetchReferrals = async (): Promise<BriefReferral[]> => {
    try {
        const tempReferrals = await apiFetch(Endpoint.REFERRALS_OUTSTANDING)
            .then((resp) => resp.json())
            .catch((err) => alert("Error occured while trying to load outstanding referrals!"));
        const resultRows = tempReferrals
            .sort(
                (a: IOutstandingReferral, b: IOutstandingReferral) =>
                    b.date_referred - a.date_referred
            )
            .slice(0, 5)
            .map((row: IOutstandingReferral, i: Number) => ({
                id: i,
                client_id: row.id,
                full_name: row.full_name,
                type: concatenateReferralType(row),
                date_referred: row.date_referred,
            }));
        return resultRows;
    } catch (e) {
        return [];
    }
};
