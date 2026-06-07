import { Model } from "@nozbe/watermelondb";
import { field, date, readonly, text, relation } from "@nozbe/watermelondb/decorators";
import { mobileGenericField, modelName, tableKey } from "./constant";
import Client from "./Client";
import { SyncableModel } from "./interfaces/SyncableModel";

export default class SuccessStory extends Model implements SyncableModel {
    static table = modelName.success_stories;
    static associations = {
        clients: { type: mobileGenericField.belongs_to, key: tableKey.client_id },
        users: { type: mobileGenericField.belongs_to, key: tableKey.created_by_user_id },
    } as const;

    @text("title") title;
    @text("refugee_origin") refugee_origin;
    @text("refugee_duration") refugee_duration;
    @text("diagnosis") diagnosis;
    @text("treatment_service") treatment_service;
    @text("part1_background") part1_background;
    @text("part2_challenge") part2_challenge;
    @text("part3_introduction") part3_introduction;
    @text("part4_action") part4_action;
    @text("part5_impact") part5_impact;
    @text("publish_permission") publish_permission;
    @text("status") status;
    @text("date") date;

    // Local-only image URI for on-device preview. The binary is never synced —
    // the photo otherwise lives on the dedicated REST image endpoints (online only).
    @text("photo") photo;

    @readonly @date(mobileGenericField.created_at) createdAt;
    @readonly @date(mobileGenericField.updated_at) updatedAt;

    @relation(modelName.clients, tableKey.client_id) client;
    @relation(modelName.users, tableKey.created_by_user_id) createdByUser;

    getBriefIdentifier = async (): Promise<string> => {
        const fetchedClient: Client = await this.client.fetch();
        return `Success story for ${fetchedClient.getBriefIdentifier()}`;
    };
}
