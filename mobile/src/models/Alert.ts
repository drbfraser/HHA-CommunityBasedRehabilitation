import { alertField } from "@cbr/common/src/forms/Alert/alertFields";
import { Model } from "@nozbe/watermelondb";
import { date, readonly, text, json } from "@nozbe/watermelondb/decorators";
import { mobileGenericField, modelName } from "./constant";
import { SyncableModel } from "./interfaces/SyncableModel";

const sanitizedUnreadUsers = (userId: String) => {
    console.log(userId);
    return Array.isArray(userId) ? userId.map(String) : [];
};

export default class Alert extends Model implements SyncableModel {
    static table = modelName.alert;

    @text(alertField.subject) subject;
    @text(alertField.priority) priority;
    @text(alertField.alert_message) alert_message;
    @text(alertField.created_by_user) created_by_user;
    @json(alertField.unread_by_users, sanitizedUnreadUsers) unread_by_users;

    @readonly @date(alertField.date_created) createdAt;
    @readonly @date(mobileGenericField.updated_at) updatedAt;

    getBriefIdentifier = (): string => {
        return `Alert with subject ${this.subject}`;
    };
}
