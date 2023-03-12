import { alertField } from "@cbr/common/src/forms/Alert/alertFields";
import { ClientField } from "@cbr/common/src/forms/Client/clientFields";
import { addColumns, schemaMigrations, createTable } from "@nozbe/watermelondb/Schema/migrations";
import { mobileGenericField, modelName, tableKey } from "./constant";

export default schemaMigrations({
    migrations: [
        {
            toVersion: 3,
            steps: [
                createTable({
                    name: modelName.alert,
                    columns: [
                        { name: alertField.subject, type: "string" },
                        { name: alertField.priority, type: "string" },
                        { name: alertField.alert_message, type: "string" },
                        { name: alertField.unread_by_users, type: "string" },
                        { name: alertField.created_by_user, type: "string" },
                        { name: alertField.date_created, type: "number" },
                        { name: mobileGenericField.updated_at, type: "number" },
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
        },
    ],
});
