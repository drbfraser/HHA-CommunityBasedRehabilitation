import { Model } from "@nozbe/watermelondb";
import { field, date, readonly, text } from "@nozbe/watermelondb/decorators";
import { writer } from "@nozbe/watermelondb/decorators/action";

export default class User extends Model {
    static table = "users";

    @text("username") username;
    @text("password") password;
    @text("first_name") first_name;
    @text("last_name") last_name;
    @text("phone_number") phone_number;
    @text("role") role;
    @field("zone") zone;
    @field("is_active") isActive;

    @readonly @date("created_at") createdAt;
    @readonly @date("updated_at") updateAt;
}
