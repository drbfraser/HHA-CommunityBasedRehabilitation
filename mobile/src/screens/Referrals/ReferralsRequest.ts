import { IReferral } from "@cbr/common";
import { modelName } from "../../models/constant";
import { dbType } from "../../util/watermelonDatabase";
import i18n from "i18next";
import Client from "@/src/models/Client";

export type BriefReferral = {
    id: string;
    client_id: string;
    full_name: string;
    type: string;
    date_referred: number;
    resolved: boolean;
};

const concatenateReferralType = (referral: IReferral) => {
    const referralTypes: String[] = [];
    if (referral.orthotic) {
        referralTypes.push(i18n.t("referral.orthotic"));
    }
    if (referral.physiotherapy) {
        referralTypes.push(i18n.t("referral.physiotherapy"));
    }
    if (referral.prosthetic) {
        referralTypes.push(i18n.t("referral.prosthetic"));
    }
    if (referral.wheelchair) {
        referralTypes.push(i18n.t("referral.wheelchair"));
    }
    if (referral.hha_nutrition_and_agriculture_project) {
        referralTypes.push(i18n.t("referral.hhaNutritionAndAgricultureProjectAbbr"));
    }
    if (referral.mental_health) {
        referralTypes.push(i18n.t("referral.mental"));
    }
    if (referral.services_other) {
        referralTypes.push(referral.services_other);
    }

    return referralTypes.join(", ");
};

export const fetchReferrals = async (database: dbType): Promise<BriefReferral[]> => {
    const clientReferrals: BriefReferral[] = [];

    try {
        const fetchedClients = await database.get(modelName.clients).query().fetch();

        for (const clientData of fetchedClients) {
            const client = clientData as Client;

            if (client.is_active) {
                const referrals = await client.referrals.fetch();

                referrals.forEach((referral) => {
                    const r: BriefReferral = {
                        id: referral.id,
                        client_id: client.id,
                        full_name: client.full_name,
                        type: concatenateReferralType(referral),
                        date_referred: referral.date_referred,
                        resolved: referral.resolved,
                    };

                    clientReferrals.push(r);
                });
            }
        }

        return clientReferrals.sort((a, b) => b.date_referred - a.date_referred);
    } catch (error) {
        console.error("Failed to fetch referrals:", error);
        return [];
    }
};
