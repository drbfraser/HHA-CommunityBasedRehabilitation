import { Model } from "@nozbe/watermelondb";
import { field, text, relation } from "@nozbe/watermelondb/decorators";

export default class Improvement extends Model {
    static table = "improvements";
    static associations = {
        visits: { type: "belongs_to", key: "visit_id" },
    } as const;

    @field("risk_type") risk_type;
    @field("provided") provided;
    @text("desc") desc;

    @relation("visits", "visit_id") visit;
}
