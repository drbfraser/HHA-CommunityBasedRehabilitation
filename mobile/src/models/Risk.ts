import { FormField } from "@cbr/common/src/forms/Risks/riskFormFields";
import { Model } from "@nozbe/watermelondb";
import { date, text, relation } from "@nozbe/watermelondb/decorators";
import { mobileGenericField, modelName, tableKey } from "./constant";

export default class Risk extends Model {
    static table = modelName.risks;
    static associations = {
        clients: { type: mobileGenericField.belongs_to, key: tableKey.client_id },
    } as const;

    @text(FormField.risk_type) risk_type;
    @text(FormField.risk_level) risk_level;
    @text(FormField.requirement) requirement;
    @text(FormField.goal) goal;

    @date(FormField.timestamp) timestamp;

    @relation(modelName.clients, tableKey.client_id) client;
}
