import { Model } from "@nozbe/watermelondb";
import { field, date, text, relation } from "@nozbe/watermelondb/decorators";
import { writer } from "@nozbe/watermelondb/decorators/action";

export default class Referral extends Model {
    static table = "referrals";
    static associations = {
        clients: { type: "belongs_to", key: "client_id" },
        users: { type: "belongs_to", key: "user_id" },
    } as const;

    @field("date_referred") date_referred;
    @field("date_resolved") date_resolved;
    @field("resolved") resolved;
    @text("outcome") outcome;
    // @text("picture") picture;
    @field("wheelchair") wheelchair;
    @text("wheelchair_experience") wheelchair_experience;
    @field("hip_width") hip_width;
    @field("wheelchair_owned") wheelchair_owned;
    @field("wheelchair_repairable") wheelchair_repairable;
    @field("physiotherapy") physiotherapy;
    @text("condition") condition;
    @field("prosthetic") prosthetic;
    @text("prosthetic_injury_location") prosthetic_injury_location;
    @field("orthotic") orthotic;
    @text("orthotic_injury_location") orthotic_injury_location;
    @text("services_other") services_other;
    @date("created_at") created_at;
    @date("updated_at") updated_at;

    @relation("clients", "client_id") client;
    @relation("users", "user_id") user;

    @writer async updateReferral(outcome) {
        await this.update((referral) => {
            referral.resolved = true;
            referral.outcome = outcome;
            referral.date_resolved = new Date().getTime();
        });
    };
}
