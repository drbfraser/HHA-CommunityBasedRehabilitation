import { Model } from "@nozbe/watermelondb";
import { field, date, readonly, text, relation } from "@nozbe/watermelondb/decorators";
import { mobileGenericField, modelName, tableKey } from "./constant";
import Client from "./Client";
import { SyncableModel } from "./interfaces/SyncableModel";

export default class PatientNote extends Model implements SyncableModel {
    static table = modelName.patient_notes;
    static associations = {
        clients: { type: mobileGenericField.belongs_to, key: tableKey.client_id },
    } as const;

    @text("note") note;
    @readonly @date(mobileGenericField.created_at) createdAt;

    @relation(modelName.clients, tableKey.client_id) client;

    getBriefIdentifier = async (): Promise<string> => {
        const fetchedClient: Client = await this.client.fetch();
        return `Patient note for ${fetchedClient.getBriefIdentifier()}`;
    };
}
