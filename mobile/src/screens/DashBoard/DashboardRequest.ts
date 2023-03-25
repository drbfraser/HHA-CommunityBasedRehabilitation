import { clientPrioritySort, getZones, IOutstandingReferral } from "@cbr/common";
import { IClientSummary } from "@cbr/common";
import { riskLevels } from "@cbr/common";
import { modelName } from "../../models/constant";
import { ClientListRow } from "../ClientList/ClientListRequest";
import { dbType } from "../../util/watermelonDatabase";
import { Q } from "@nozbe/watermelondb";
import { ClientField } from "@cbr/common/src/forms/Client/clientFields";

export type BriefReferral = {
    id: string;
    client_id: string;
    full_name: string;
    type: string;
    date_referred: number;
};

const concatenateReferralType = (referral: IOutstandingReferral) => {
    const referralTypes: String[] = [];
    if (referral.orthotic) {
        referralTypes.push("Orthotic");
    }
    if (referral.physiotherapy) {
        referralTypes.push("Physiotherapy");
    }
    if (referral.prosthetic) {
        referralTypes.push("Prosthetic");
    }
    if (referral.wheelchair) {
        referralTypes.push("Wheelchair");
    }
    // For some reason referral.hha_nutrition_and_agriculture is only returning undefined
    if (referral.emergency_food_aid || referral.agriculture_livelihood_program_enrollment) {
        referralTypes.push("HHANAP");
    }
    if (referral.services_other) {
        referralTypes.push(referral.services_other);
    }

    return referralTypes.join(", ");
};

export const fetchAllClientsFromDB = async (database: dbType): Promise<ClientListRow[]> => {
    try {
        const zones = await getZones();
        const tempClients: any = await database
            .get(modelName.clients)
            .query(Q.where(ClientField.is_active, true));
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
                NutritionLevel: riskLevels[responseRow.nutrit_risk_level].color,
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

    await database
        .get(modelName.clients)
        .query()
        .fetch()
        .then((fetchedClients) => {
            let clientCount = 0;

            fetchReferrals = new Promise((resolve) => {
                fetchedClients.forEach(async (client) => {
                    const referrals = await client.outstandingReferrals.fetch();
                    if (referrals.length > 0) {
                        referrals.forEach((referral) => {
                            const currReferral: BriefReferral = {
                                id: referral.id,
                                client_id: client.id,
                                full_name: client.full_name,
                                type: concatenateReferralType(referral),
                                date_referred: referral.date_referred,
                            };

                            clientReferrals.push(currReferral);
                        });
                    }

                    clientCount++;
                    if (clientCount == fetchedClients.length) {
                        resolve();
                    }
                });
            });
        });

    await fetchReferrals;
    return clientReferrals
        .sort((a: BriefReferral, b: BriefReferral) => b.date_referred - a.date_referred)
        .slice(0, 5); /* Display 5 most recent outstanding referrals */
};
