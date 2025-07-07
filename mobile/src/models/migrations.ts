import { BaseSurveyField, ReferralField, VisitField } from "@cbr/common";
import { alertField } from "@cbr/common/src/forms/Alert/alertFields";
import { ClientField } from "@cbr/common/src/forms/Client/clientFields";
import { addColumns, schemaMigrations, createTable } from "@nozbe/watermelondb/Schema/migrations";
import { mobileGenericField, modelName, tableKey } from "./constant";

export default schemaMigrations({
    migrations: [
        {
            toVersion: 7,
            steps: [
                addColumns({
                    table: modelName.risks,
                    columns: [
                        { name: "cancellation_reason", type: "string" },
                    ],
                }),
            ],
        },
        {
            toVersion: 6,
            steps: [
                addColumns({
                    table: modelName.risks,
                    columns: [
                        { name: "goal_name", type: "string" },
                        { name: "goal_status", type: "string" },
                        { name: "start_date", type: "number" },
                        { name: "end_date", type: "number" },
                    ],
                }),
            ],
        },

        {
            toVersion: 5,
            steps: [
                addColumns({
                    table: modelName.clients,
                    columns: [
                        {
                            name: ClientField.mental_risk_level,
                            type: "string",
                        },
                        {
                            name: ClientField.mental_timestamp,
                            type: "number",
                        },
                    ],
                }),
                addColumns({
                    table: modelName.referrals,
                    columns: [
                        {
                            name: ReferralField.mental_health,
                            type: "boolean",
                        },
                        {
                            name: ReferralField.mental_health_condition,
                            type: "string",
                        },
                        {
                            name: ReferralField.mental_condition_other,
                            type: "string",
                        },
                    ],
                }),
                addColumns({
                    table: modelName.visits,
                    columns: [
                        {
                            name: VisitField.mental_visit,
                            type: "boolean",
                        },
                    ],
                }),
                addColumns({
                    table: modelName.surveys,
                    columns: [
                        {
                            name: BaseSurveyField.health_have_mental_condition,
                            type: "boolean",
                        },
                    ],
                }),
            ],
        },
        {
            toVersion: 4,
            steps: [
                addColumns({
                    table: modelName.referrals,
                    columns: [
                        {
                            name: ReferralField.hha_nutrition_and_agriculture_project,
                            type: "boolean",
                        },
                        {
                            name: ReferralField.emergency_food_aid,
                            type: "boolean",
                        },
                        {
                            name: ReferralField.agriculture_livelihood_program_enrollment,
                            type: "boolean",
                        },
                    ],
                }),
            ],
        },
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
                        { name: "created_date", type: "number" },
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
