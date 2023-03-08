import { alertField } from "@cbr/common/src/forms/Alert/alertFields";
import { ClientField } from "@cbr/common/src/forms/Client/clientFields";
import { addColumns, createTable, schemaMigrations } from "@nozbe/watermelondb/Schema/migrations";
import { modelName, tableKey } from "./constant";

export default schemaMigrations({
    migrations: [
        { 
            toVersion: 3,
            steps: [
                createTable({
                    name: modelName.alerts,
                    columns: [
                        { name: tableKey.alerts_id, type: "string", isIndexed: true },
                        { name: alertField.alert_message, type: "string" },
                        { name: alertField.created_by_user, type: "string" },
                        { name: alertField.date_created, type: "string" },
                        { name: alertField.priority, type: "string" },
                        { name: alertField.subject, type: "string" },
                        { name: alertField.unread_by_users, type: "string" },
                    ],
                }),
            ],
        },
        {
            toVersion: 2,
            steps: [
                addColumns({
                    table: modelName.clients,
                    columns: [{ name: ClientField.is_active, type: "boolean" }],
                }),
            ],
        }
    ],
});
