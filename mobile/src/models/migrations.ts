import { ClientField } from "@cbr/common";
import { addColumns, schemaMigrations } from "@nozbe/watermelondb/Schema/migrations";
import { modelName } from "./constant";

export default schemaMigrations({
    migrations: [
        {
            toVersion: 2,
            steps: [
                addColumns({
                    table: modelName.clients,
                    columns: [{ name: "is_active", type: "boolean" }],
                }),
            ],
        },
    ],
});
