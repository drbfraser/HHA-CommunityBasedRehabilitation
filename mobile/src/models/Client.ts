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
    @field("caregiver_present") caregiver_present;
    @text("caregiver_name") caregiver_name;
    @text("caregiver_phone") caregiver_phone;
    @text("caregiver_email") caregiver_email;
    @text("health_risk_level") health_risk_level;
    @text("social_risk_level") social_risk_level;
    @text("educat_risk_level") educat_risk_level;
    @date("last_visit_date") last_visit_date;

    @readonly @date("created_at") createdAt;
    @readonly @date("updated_at") updateAt;

    @relation("users", "user_id") user;

    @children("risks") risks;

    @writer async updateRisk(type, level) {
        await this.update((client) => {
            if (type == "HEALTH") {
                client.health_risk_level = level;
            } else if (type == "SOCIAL") {
                client.social_risk_level = level;
            } else {
                client.educat_risk_level = level;
            }
        });
    }
}
