import { Model } from "@nozbe/watermelondb";
import { field, text, relation } from "@nozbe/watermelondb/decorators";

export default class Outcome extends Model {
    static table = "outcomes";
    static associations = {
        visits: { type: "belongs_to", key: "visit_id" },
    } as const;

    @field("risk_type") risk_type;
    @field("goal_met") goal_met;
    @text("outcome") outcome;

    @relation("visits", "visit_id") visit;
}
