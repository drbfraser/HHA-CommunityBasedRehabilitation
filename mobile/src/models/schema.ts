import { appSchema, tableSchema } from "@nozbe/watermelondb";

export default appSchema({
    version: 1,
    tables: [
        tableSchema({
            name: "users",
            columns: [
                { name: "username", type: "string" },
                { name: "password", type: "string" },
                { name: "first_name", type: "string" },
                { name: "last_name", type: "string" },
                { name: "phone_number", type: "string", isOptional: true },
                { name: "role", type: "string" },
                { name: "zone", type: "number" },
                { name: "is_active", type: "boolean", isOptional: true },
                { name: "created_at", type: "number" },
                { name: "updated_at", type: "number" },
            ],
        }),
    ],
});
