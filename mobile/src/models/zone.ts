import { Model } from "@nozbe/watermelondb";
import { field, date, readonly, children, text } from "@nozbe/watermelondb/decorators";
import { writer } from "@nozbe/watermelondb/decorators/action";

export default class Zone extends Model {
    static table = "zones";
    static associations = {
        users: { type: "has_many", foreignKey: "zone_id" },
    } as const;

    @text("zone_name") zoneName;

    @readonly @date("created_at") createdAt;
    @readonly @date("updated_at") updateAt;

    @children("users") users;
}
