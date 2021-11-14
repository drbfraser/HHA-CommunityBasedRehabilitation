import { Model } from "@nozbe/watermelondb";
import {
    field,
    date,
    text,
    readonly,
    relation,
    children,
    json,
} from "@nozbe/watermelondb/decorators";
import { writer } from "@nozbe/watermelondb/decorators/action";

const sanitizeDisability = (rawDisability) => {
    return Array.isArray(rawDisability) ? rawDisability.map(Number) : [];
};

export default class Client extends Model {
    static table = "clients";
    static associations = {
        users: { type: "belongs_to", key: "user_id" },
        risks: { type: "has_many", foreignKey: "client_id" },
        surveys: { type: "has_many", foreignKey: "client" },
        visits: { type: "has_many", foreignKey: "client_id" },
    } as const;

    @text("first_name") first_name;
    @text("last_name") last_name;
    @text("full_name") full_name;
    @date("birth_date") birth_date;
    @field("gender") gender;
    @text("phone_number") phone_number;
    @json("disability", sanitizeDisability) disability;
    @text("other_disability") other_disability;
    @field("longitude") longitude;
    @field("latitude") latitude;
    @field("zone") zone;
    @field("village") village;
    @field("picture") picture;
    @field("caregiver_present") caregiver_present;
    @text("caregiver_name") caregiver_name;
    @text("caregiver_phone") caregiver_phone;
    @text("caregiver_email") caregiver_email;
    @text("health_risk_level") health_risk_level;
    @date("health_timestamp") health_timestamp;
    @text("social_risk_level") social_risk_level;
    @date("social_timestamp") social_timestamp;
    @text("educat_risk_level") educat_risk_level;
    @date("educat_timestamp") educat_timestamp;
    @date("last_visit_date") last_visit_date;

    @readonly @date("created_at") createdAt;
    @readonly @date("updated_at") updatedAt;

    @relation("users", "user_id") user;

    @children("risks") risks;
    @children("surveys") surveys;
    @children("visits") visits;

    @writer async updateRisk(type, level, time) {
        await this.update((client) => {
            if (type == "HEALTH") {
                client.health_risk_level = level;
                client.health_timestamp = time;
            } else if (type == "SOCIAL") {
                client.social_risk_level = level;
                client.social_timestamp = time;
            } else {
                client.educat_risk_level = level;
                client.educat_timestamp = time;
            }
        });
    }

    @writer async newRiskTime() {
        await this.update((client) => {
            client.educat_timestamp = this.createdAt;
            client.health_timestamp = this.createdAt;
            client.social_timestamp = this.createdAt;
        });
    }

    @writer async updateVisitTime(visitTime) {
        await this.update((client) => {
            client.last_visit_date = visitTime;
        });
    }
}
