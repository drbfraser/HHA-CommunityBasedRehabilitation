import { Model } from "@nozbe/watermelondb";
import { field, date, readonly, text } from "@nozbe/watermelondb/decorators";
import { writer } from "@nozbe/watermelondb/decorators/action";

export default class User extends Model {
    static table = "users";
    static associations = {
        zones: { type: "belongs_to", key: "zone_id" },
    } as const;

    @text("username") username;
    @text("password") password;
    @text("first_name") firstName;
    @text("last_name") lastName;
    @text("phone_number") phoneNumber;
    @text("role") role;
    @field("is_active") isActive;

    @readonly @date("created_at") createdAt;
    @readonly @date("updated_at") updateAt;
}
