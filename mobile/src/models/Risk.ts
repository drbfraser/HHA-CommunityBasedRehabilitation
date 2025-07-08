import { FormField } from "@cbr/common/src/forms/Risks/riskFormFields";
import { Model } from "@nozbe/watermelondb";
import { date, text, relation, field } from "@nozbe/watermelondb/decorators";
import { mobileGenericField, modelName, tableKey } from "./constant";
import Client from "./Client";
import { SyncableModel } from "./interfaces/SyncableModel";

export default class Risk extends Model implements SyncableModel {
    static table = modelName.risks;
    static associations = {
        clients: { type: mobileGenericField.belongs_to, key: tableKey.client_id },
    } as const;

    @text(FormField.risk_type) risk_type;
    @text(FormField.risk_level) risk_level;
    @text(FormField.requirement) requirement;
    @text(FormField.goal) goal;
    @text(FormField.goal_name) goal_name;
    @text("goal_status") goal_status;
    @text("cancellation_reason") cancellation_reason;
    @text("change_type") change_type;

    @date(FormField.timestamp) timestamp;
    @field("start_date") start_date;
    @field("end_date") end_date;

    @relation(modelName.clients, tableKey.client_id) client;

    getBriefIdentifier = async (): Promise<string> => {
        const fetchedClient: Client = await this.client.fetch;

        return `Risk belonging to ${fetchedClient.getBriefIdentifier()}`;
    };
}
