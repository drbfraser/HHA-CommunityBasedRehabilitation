import { AdminField, ImprovementFormField, OutcomeFormField, VisitField } from "@cbr/common";
import { ClientField } from "@cbr/common/src/forms/Client/clientFields";
import { FormField } from "@cbr/common/src/forms/Risks/riskFormFields";
import { appSchema, tableSchema } from "@nozbe/watermelondb";
import { mobileGenericField, modelName, tableKey } from "./constant";

export default appSchema({
    version: 1,
    tables: [
        tableSchema({
            name: modelName.users,
            columns: [
                { name: AdminField.username, type: "string" },
                { name: AdminField.password, type: "string" },
                { name: AdminField.first_name, type: "string" },
                { name: AdminField.last_name, type: "string" },
                { name: AdminField.phone_number, type: "string", isOptional: true },
                { name: AdminField.role, type: "string" },
                { name: AdminField.zone, type: "number" },
                { name: AdminField.is_active, type: "boolean", isOptional: true },
                { name: mobileGenericField.created_at, type: "number" },
                { name: mobileGenericField.updated_at, type: "number" },
            ],
        }),
        tableSchema({
            name: modelName.clients,
            columns: [
                { name: tableKey.user_id, type: "string", isIndexed: true },
                { name: ClientField.first_name, type: "string" },
                { name: ClientField.last_name, type: "string" },
                { name: ClientField.full_name, type: "string" },
                { name: ClientField.birth_date, type: "number" },
                { name: ClientField.gender, type: "string" },
                { name: ClientField.phone_number, type: "string", isOptional: true },
                { name: ClientField.disability, type: "string" },
                { name: ClientField.other_disability, type: "string", isOptional: true },
                { name: ClientField.longitude, type: "string", isOptional: true },
                { name: ClientField.latitude, type: "string", isOptional: true },
                { name: ClientField.zone, type: "number" },
                { name: ClientField.village, type: "string" },
                { name: ClientField.picture, type: "string", isOptional: true },
                { name: ClientField.caregiver_present, type: "boolean" },
                { name: ClientField.caregiver_name, type: "string", isOptional: true },
                { name: ClientField.caregiver_phone, type: "string", isOptional: true },
                { name: ClientField.caregiver_email, type: "string", isOptional: true },
                { name: ClientField.health_risk_level, type: "string" },
                { name: ClientField.health_timestamp, type: "number" },
                { name: ClientField.social_risk_level, type: "string" },
                { name: ClientField.social_timestamp, type: "number" },
                { name: ClientField.educat_risk_level, type: "string" },
                { name: ClientField.educat_timestamp, type: "number" },
                { name: ClientField.last_visit_date, type: "number" },
                { name: mobileGenericField.created_at, type: "number" },
                { name: mobileGenericField.updated_at, type: "number" },
            ],
        }),
        tableSchema({
            name: modelName.risks,
            columns: [
                { name: tableKey.client_id, type: "string", isIndexed: true },
                { name: FormField.risk_type, type: "string" },
                { name: FormField.risk_level, type: "string" },
                { name: FormField.requirement, type: "string" },
                { name: FormField.goal, type: "string" },
                { name: FormField.timestamp, type: "number" },
            ],
        }),
        tableSchema({
            name: modelName.visits,
            columns: [
                { name: tableKey.client_id, type: "string", isIndexed: true },
                { name: tableKey.user_id, type: "string" },
                { name: VisitField.health_visit, type: "boolean" },
                { name: VisitField.educat_visit, type: "boolean" },
                { name: VisitField.social_visit, type: "boolean" },
                { name: VisitField.longitude, type: "string", isOptional: true },
                { name: VisitField.latitude, type: "string", isOptional: true },
                { name: VisitField.zone, type: "number" },
                { name: VisitField.village, type: "string" },
                { name: mobileGenericField.created_at, type: "number" },
            ],
        }),
        tableSchema({
            name: modelName.outcomes,
            columns: [
                { name: tableKey.visit_id, type: "string", isIndexed: true },
                { name: OutcomeFormField.riskType, type: "string" },
                { name: OutcomeFormField.goalStatus, type: "string" },
                { name: OutcomeFormField.outcome, type: "string" },
            ],
        }),
        tableSchema({
            name: modelName.improvements,
            columns: [
                { name: tableKey.visit_id, type: "string", isIndexed: true },
                { name: ImprovementFormField.riskType, type: "string" },
                { name: ImprovementFormField.provided, type: "string" },
                { name: ImprovementFormField.description, type: "string" },
            ],
        }),
    ],
});
