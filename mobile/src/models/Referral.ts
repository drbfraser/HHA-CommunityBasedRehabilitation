import { ReferralField } from "@cbr/common";
import { mobileGenericField, modelName, tableKey } from "./constant";
import { Model } from "@nozbe/watermelondb";
import { field, date, text, relation, readonly } from "@nozbe/watermelondb/decorators";
import { writer } from "@nozbe/watermelondb/decorators/action";
import Client from "./Client";
import { SyncableModel } from "./interfaces/SyncableModel";

export default class Referral extends Model implements SyncableModel {
    static table = modelName.referrals;
    static associations = {
        clients: { type: mobileGenericField.belongs_to, key: tableKey.client_id },
        users: { type: mobileGenericField.belongs_to, key: tableKey.user_id },
    } as const;

    @field(ReferralField.date_referred) date_referred;
    @field(ReferralField.date_resolved) date_resolved;
    @field(ReferralField.resolved) resolved;
    @text(ReferralField.outcome) outcome;
    @field(ReferralField.picture) picture;
    @field(ReferralField.wheelchair) wheelchair;
    @text(ReferralField.wheelchair_experience) wheelchair_experience;
    @field(ReferralField.hip_width) hip_width;
    @field(ReferralField.wheelchair_owned) wheelchair_owned;
    @field(ReferralField.wheelchair_repairable) wheelchair_repairable;
    @field(ReferralField.physiotherapy) physiotherapy;
    @text(ReferralField.condition) condition;
    @field(ReferralField.prosthetic) prosthetic;
    @text(ReferralField.prosthetic_injury_location) prosthetic_injury_location;
    @field(ReferralField.orthotic) orthotic;
    @text(ReferralField.orthotic_injury_location) orthotic_injury_location;
    @text(ReferralField.services_other) services_other;

    @readonly @date(mobileGenericField.updated_at) updatedAt;

    @relation(modelName.clients, tableKey.client_id) client;
    @relation(modelName.users, tableKey.user_id) user;

    @writer async updateReferral(outcome) {
        await this.update((referral) => {
            referral.resolved = true;
            referral.outcome = outcome;
            referral.date_resolved = new Date().getTime();
        });
    }

    getBriefIdentifier = (): string => {
        const fetchedClient: Client = this.client.fetch();

        return `Referral belonging to ${fetchedClient.getBriefIdentifier()}`;
    }
}
