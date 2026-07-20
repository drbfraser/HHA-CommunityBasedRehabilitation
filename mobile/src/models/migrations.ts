import { BaseSurveyField, ReferralField, VisitField } from "@cbr/common";
import { alertField } from "@cbr/common/src/forms/Alert/alertFields";
import { ClientField } from "@cbr/common/src/forms/Client/clientFields";
import { addColumns, schemaMigrations, createTable } from "@nozbe/watermelondb/Schema/migrations";
import { mobileGenericField, modelName, tableKey } from "./constant";

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
            toVersion: 7,
            steps: [
                addColumns({
                    table: modelName.risks,
                    columns: [{ name: "cancellation_reason", type: "string" }],
                }),
            ],
        },
        {
            toVersion: 8,
            steps: [
                addColumns({
                    table: modelName.risks,
                    columns: [{ name: "change_type", type: "string" }],
                }),
            ],
        },
        {
            toVersion: 9,
            steps: [
                createTable({
                    name: modelName.patient_notes,
                    columns: [
                        { name: "client_id", type: "string", isIndexed: true },
                        { name: "note", type: "string" },
                        { name: "created_at", type: "number" },
                    ],
                }),
            ],
        },
        {
            toVersion: 10,
            steps: [
                createTable({
                    name: modelName.success_stories,
                    columns: [
                        { name: "client_id", type: "string", isIndexed: true },
                        { name: "created_by_user_id", type: "string", isIndexed: true },
                        { name: "title", type: "string" },
                        { name: "refugee_origin", type: "string" },
                        { name: "refugee_duration", type: "string" },
                        { name: "diagnosis", type: "string" },
                        { name: "treatment_service", type: "string" },
                        { name: "part1_background", type: "string" },
                        { name: "part2_challenge", type: "string" },
                        { name: "part3_introduction", type: "string" },
                        { name: "part4_action", type: "string" },
                        { name: "part5_impact", type: "string" },
                        { name: "publish_permission", type: "string" },
                        { name: "status", type: "string" },
                        { name: "date", type: "string" },
                        { name: "photo", type: "string", isOptional: true },
                        { name: "created_at", type: "number" },
                        { name: "updated_at", type: "number" },
                    ],
                }),
            ],
        },
        {
            toVersion: 11,
            steps: [
                addColumns({
                    table: modelName.success_stories,
                    columns: [
                        { name: "photo_2", type: "string", isOptional: true },
                        { name: "photo_3", type: "string", isOptional: true },
                        { name: "photo_4", type: "string", isOptional: true },
                        { name: "photo_5", type: "string", isOptional: true },
                    ],
                }),
            ],
        },
        {
            toVersion: 12,
            steps: [
                addColumns({
                    table: modelName.referrals,
                    columns: [
                        {
                            name: ReferralField.safe_guarding,
                            type: "boolean",
                        },
                        {
                            name: ReferralField.safe_guarding_observation,
                            type: "string",
                        },
                        {
                            name: ReferralField.safe_guarding_person_involved,
                            type: "string",
                        },
                        {
                            name: ReferralField.safe_guarding_action_needed,
                            type: "string",
                        },
                    ],
                }),
            ],
        },
    ],
});
