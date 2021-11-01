import { Model } from "@nozbe/watermelondb";
import { field, date, text, readonly, relation, children } from "@nozbe/watermelondb/decorators";
import { writer } from "@nozbe/watermelondb/decorators/action";

export default class Risk extends Model {
    static table = "risks";
    static associations = {
        clients: { type: "belongs_to", key: "client_id" },
    } as const;

    @text("risk_type") risk_type;
    @text("risk_level") risk_level;
    @text("requirement") requirement;
    @text("goal") goal;

    @readonly @date("created_at") createdAt;
    @readonly @date("updated_at") updateAt;

    @relation("clients", "client_id") client;
}
