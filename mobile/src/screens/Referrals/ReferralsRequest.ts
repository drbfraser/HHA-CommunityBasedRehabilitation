import { modelName } from "../../models/constant";
import { dbType } from "../../util/watermelonDatabase";
import { logPerf } from "../../util/perfTiming";
import i18n from "i18next";
import Client from "@/src/models/Client";
import Referral from "@/src/models/Referral";

export type BriefReferral = {
    id: string;
    client_id: string;
    full_name: string;
    type: string;
    type_keys: string[];
    date_referred: number;
    resolved: boolean;
};

const getReferralTypes = (referral: Referral) => {
    const keys: string[] = [];
    const labels: string[] = [];

    if (referral.orthotic) {
        keys.push("orthotic");
        labels.push(i18n.t("referral.orthotic"));
    }
    if (referral.physiotherapy) {
        keys.push("physiotherapy");
        labels.push(i18n.t("referral.physiotherapy"));
    }
    if (referral.prosthetic) {
        keys.push("prosthetic");
        labels.push(i18n.t("referral.prosthetic"));
    }
    if (referral.wheelchair) {
        keys.push("wheelchair");
        labels.push(i18n.t("referral.wheelchair"));
    }
    if (referral.hha_nutrition_and_agriculture_project) {
        keys.push("hha_nutrition_and_agriculture_project");
        labels.push(i18n.t("referral.hhaNutritionAndAgricultureProjectAbbr"));
    }
    if (referral.mental_health) {
        keys.push("mental_health");
        labels.push(i18n.t("referral.mentalHealth"));
    }
    if (referral.services_other) {
        labels.push(referral.services_other);
    }

    return { type: labels.join(", "), type_keys: keys };
};

export const fetchReferrals = async (database: dbType): Promise<BriefReferral[]> => {
    const clientReferrals: BriefReferral[] = [];

    try {
        const queryStart = Date.now();
        const fetchedClients = (await database.get(modelName.clients).query().fetch()) as Client[];
        logPerf("Referrals", "clients db query", queryStart, `${fetchedClients.length} clients`);

        // Referrals of active clients only. One query for all referrals, matched to their client
        // here, instead of one query per client.
        const activeClients = new Map<string, Client>();
        fetchedClients.forEach((client) => {
            if (client.is_active) {
                activeClients.set(client.id, client);
            }
        });

        const referralsStart = Date.now();
        const referrals = (await database.get(modelName.referrals).query().fetch()) as Referral[];
        logPerf("Referrals", "referrals db query", referralsStart, `${referrals.length} referrals`);

        referrals.forEach((referral) => {
            const client = activeClients.get(referral.client.id);
            if (!client) {
                return;
            }
            const { type, type_keys } = getReferralTypes(referral);

            clientReferrals.push({
                id: referral.id,
                client_id: client.id,
                full_name: client.full_name,
                type,
                type_keys,
                date_referred: referral.date_referred,
                resolved: referral.resolved,
            });
        });

        return clientReferrals.sort((a, b) => b.date_referred - a.date_referred);
    } catch (error) {
        console.error("Failed to fetch referrals:", error);
        return [];
    }
};
