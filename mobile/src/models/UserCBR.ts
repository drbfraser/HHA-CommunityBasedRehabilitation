import { AdminField } from "@cbr/common";
import { Model } from "@nozbe/watermelondb";
import { field, date, readonly, text, children } from "@nozbe/watermelondb/decorators";
import { writer } from "@nozbe/watermelondb/decorators/action";
import { mobileGenericField, modelName, tableKey } from "./constant";

export default class User extends Model {
    static table = modelName.users;
    static associations = {
        clients: { type: mobileGenericField.has_many, foreignKey: tableKey.user_id },
        surveys: { type: mobileGenericField.has_many, foreignKey: tableKey.user_id },
        visits: { type: mobileGenericField.has_many, foreignKey: tableKey.user_id },
    } as const;

    @text(AdminField.username) username;
    @text(AdminField.password) password;
    @text(AdminField.first_name) first_name;
    @text(AdminField.last_name) last_name;
    @text(AdminField.phone_number) phone_number;
    @text(AdminField.role) role;
    @field(AdminField.zone) zone;
    @field(AdminField.is_active) is_active;

    @readonly @date(mobileGenericField.created_at) createdAt;
    @readonly @date(mobileGenericField.updated_at) updatedAt;

    @writer async updatePassword(newPass) {
        await this.update((user) => {
            user.password = newPass;
        });
    }

    @children(modelName.clients) clients;
    @children(modelName.surveys) surveys;
    @children(modelName.visits) visits;
}
