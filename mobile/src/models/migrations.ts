import { ClientField } from "@cbr/common/src/forms/Client/clientFields";
import { addColumns, schemaMigrations } from "@nozbe/watermelondb/Schema/migrations";
import { modelName } from "./constant";

export default schemaMigrations({
    migrations: [
        {
            toVersion: 2,
            steps: [
                addColumns({
                    table: modelName.clients,
                    columns: [{ name: ClientField.is_active, type: "boolean" }],
                }),
            ],
        },
    ],
});
