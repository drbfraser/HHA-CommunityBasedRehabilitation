import {
    apiFetch,
    clientPrioritySort,
    Endpoint,
    getZones,
    IOutstandingReferral,
} from "@cbr/common";
import { IClientSummary } from "@cbr/common";
import { riskLevels } from "@cbr/common";
import { ClientListRow } from "../ClientList/ClientListRequest";
import { dbType } from "../../util/watermelonDatabase";

export type BriefReferral = {
    id: string;
    client_id: string;
    full_name: string;
    type: string;
    date_referred: number;
};

const concatenateReferralType = (referral: IOutstandingReferral) => {
    const referralTypes: String[] = [];
    if (referral.orthotic) { referralTypes.push("Orthotic"); };
    if (referral.physiotherapy) { referralTypes.push("Physiotherapy"); };
    if (referral.prosthetic) { referralTypes.push("Prosthetic"); };
    if (referral.wheelchair) { referralTypes.push("Wheelchair"); };
    if (referral.services_other) { referralTypes.push(referral.services_other); };

    return referralTypes.join(", ");
};

export const fetchAllClientsFromApi = async (): Promise<ClientListRow[]> => {
    try {
        const zones = await getZones();
        const tempClients = await apiFetch(Endpoint.CLIENTS)
            .then((resp) => resp.json())
            .catch((err) => alert("Error occured while trying to load priority clients!"));

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

export const fetchReferrals = async (database: dbType): Promise<BriefReferral[]> => {
    let clientReferrals: Array<BriefReferral> = [];
    let fetchReferrals;

    await database.get("clients").query().fetch().then((fetchedClients) => {
        let clientCount = 0;

        fetchReferrals = new Promise ((resolve) => {
            fetchedClients.forEach(async (client) => {
                const referrals = await client.outstandingReferrals.fetch();
                if (referrals.length > 0) {
                    referrals.forEach(referral => {
                        const currReferral: BriefReferral = {
                            id: referral.id,
                            client_id: client.id,
                            full_name: client.full_name,
                            type: concatenateReferralType(referral),
                            date_referred: referral.date_referred,
                        }
        
                        clientReferrals.push(currReferral);
                    });
                }

                clientCount++;
                if (clientCount == fetchedClients.length) {
                    resolve();
                }
            });
        })
    });

    await fetchReferrals;
    return clientReferrals
            .sort(
                (a: BriefReferral, b: BriefReferral) =>
                    b.date_referred - a.date_referred
            )
            .slice(0, 5); /* Display 5 most recent outstanding referrals */
}