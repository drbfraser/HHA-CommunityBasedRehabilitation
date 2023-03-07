import { Model } from "@nozbe/watermelondb";
import {
    date,
    text,
    relation,
    json,
} from "@nozbe/watermelondb/decorators";
import { mobileGenericField, modelName, tableKey } from "./constant";
import { SyncableModel } from "./interfaces/SyncableModel";
import { alertField } from "@cbr/common/src/forms/Alert/alertFields";

const sanitizeUnreadUsers = (user) => {
    return Array.isArray(user) ? user.map(String) : [];
};

export default class Alert extends Model implements SyncableModel {
    static table = modelName.alerts;
    static associations = {
        users: { type: mobileGenericField.belongs_to, key: tableKey.user_id },
    } as const;

    @text(alertField.subject) subject;
    @text(alertField.priority) priority;
    @text(alertField.alert_message) alert_message;
    @date(alertField.date_created) date_created;
    @json(alertField.unread_by_users, sanitizeUnreadUsers) disability;

    @relation(modelName.users, "created_by_user") created_by_user;


    getBriefIdentifier = (): string => {
        return `Alert message with subject ${this.subject}`;
    };
}
