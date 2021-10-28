import { appSchema, tableSchema } from "@nozbe/watermelondb";

export default appSchema({
    version: 1,
    tables: [
        tableSchema({
            name: "zones",
            columns: [
                { name: "zone_name", type: "string" },
                { name: "created_at", type: "number" },
                { name: "updated_at", type: "number" },
            ],
        }),
        tableSchema({
            name: "users",
            columns: [
                { name: "zone_id", type: "string", isIndexed: true },
                { name: "username", type: "string" },
                { name: "first_name", type: "string" },
                { name: "last_name", type: "string" },
                { name: "phone_number", type: "string", isOptional: true },
                { name: "role", type: "string" },
                { name: "is_active", type: "boolean", isOptional: true },
                { name: "created_at", type: "number" },
                { name: "updated_at", type: "number" },
            ],
        }),
    ],
});
