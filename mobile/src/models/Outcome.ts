import { OutcomeFormField } from "@cbr/common";
import { Model } from "@nozbe/watermelondb";
import { field, text, relation } from "@nozbe/watermelondb/decorators";
import { mobileGenericField, modelName, tableKey } from "./constant";

export default class Outcome extends Model {
    static table = modelName.outcomes;
    static associations = {
        visits: { type: mobileGenericField.belongs_to, key: tableKey.visit_id },
    } as const;

    @field(OutcomeFormField.riskType) risk_type;
    @field(OutcomeFormField.goalStatus) goal_met;
    @text(OutcomeFormField.outcome) outcome;

    @relation(modelName.visits, tableKey.visit_id) visit;
}
