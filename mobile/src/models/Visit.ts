import { Model } from "@nozbe/watermelondb";
import { field, date, readonly, relation, children } from "@nozbe/watermelondb/decorators";
import { writer } from "@nozbe/watermelondb/decorators/action";

export default class Visit extends Model {
    static table = "visits";
    static associations = {
        clients: { type: "belongs_to", key: "client_id" },
        users: { type: "belongs_to", key: "user_id" },
        improvements: { type: "has_many", foreignKey: "visit_id" },
        outcomes: { type: "has_many", foreignKey: "visit_id" },
    } as const;

    @field("health_visit") health_visit;
    @field("educat_visit") educat_visit;
    @field("social_visit") social_visit;
    @field("longitude") longitude;
    @field("latitude") latitude;
    @field("zone") zone;
    @field("village") village;

    @readonly @date("created_at") createdAt;

    @relation("clients", "client_id") client;
    @relation("users", "user_id") user;
    @children("outcomes") outcomes;
    @children("improvements") improvements;
}
