import {
    AdminField,
    ImprovementFormField,
    OutcomeFormField,
    VisitField,
    BaseSurveyField,
    ReferralField,
} from "@cbr/common";
import { ClientField } from "@cbr/common/src/forms/Client/clientFields";
import { alertField } from "@cbr/common/src/forms/Alert/alertFields";
import { FormField } from "@cbr/common/src/forms/Risks/riskFormFields";
import { appSchema, tableSchema } from "@nozbe/watermelondb";
import { mobileGenericField, modelName, tableKey } from "./constant";

export default appSchema({
    version: 8,
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
                { name: ClientField.hcr_type, type: "string", isOptional: true },
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
                { name: ClientField.nutrit_risk_level, type: "string" },
                { name: ClientField.nutrit_timestamp, type: "number" },
                { name: ClientField.mental_risk_level, type: "string" },
                { name: ClientField.mental_timestamp, type: "number" },
                { name: ClientField.last_visit_date, type: "number" },
                { name: ClientField.is_active, type: "boolean" },
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
                { name: FormField.goal_name, type: "string" },
                { name: "goal_status", type: "string" },
                { name: FormField.timestamp, type: "number" },
                { name: "start_date", type: "number" },
                { name: "end_date", type: "number" },
                { name: "cancellation_reason", type: "string" },
                { name: "change_type", type: "string" },
            ],
        }),
        tableSchema({
            name: modelName.referrals,
            columns: [
                { name: tableKey.client_id, type: "string", isIndexed: true },
                { name: tableKey.user_id, type: "string", isIndexed: true },
                { name: ReferralField.date_referred, type: "number" },
                { name: ReferralField.date_resolved, type: "number" },
                { name: ReferralField.resolved, type: "boolean" },
                { name: ReferralField.outcome, type: "string" },
                { name: ReferralField.picture, type: "string", isOptional: true },
                { name: ReferralField.wheelchair, type: "boolean" },
                { name: ReferralField.wheelchair_experience, type: "string" },
                { name: ReferralField.hip_width, type: "number" },
                { name: ReferralField.wheelchair_owned, type: "boolean" },
                { name: ReferralField.wheelchair_repairable, type: "boolean" },
                { name: ReferralField.physiotherapy, type: "boolean" },
                { name: ReferralField.condition, type: "string" },
                { name: ReferralField.prosthetic, type: "boolean" },
                { name: ReferralField.prosthetic_injury_location, type: "string" },
                { name: ReferralField.orthotic, type: "boolean" },
                { name: ReferralField.orthotic_injury_location, type: "string" },
                { name: ReferralField.services_other, type: "string" },
                { name: ReferralField.hha_nutrition_and_agriculture_project, type: "boolean" },
                { name: ReferralField.emergency_food_aid, type: "boolean" },
                { name: ReferralField.agriculture_livelihood_program_enrollment, type: "boolean" },
                { name: ReferralField.mental_health, type: "boolean" },
                { name: ReferralField.mental_health_condition, type: "string" },
                { name: ReferralField.mental_condition_other, type: "string" },
                { name: mobileGenericField.updated_at, type: "number" },
            ],
        }),
        tableSchema({
            name: modelName.surveys,
            columns: [
                { name: tableKey.client_id, type: "string", isIndexed: true },
                { name: tableKey.user_id, type: "string", isIndexed: true },
                { name: BaseSurveyField.survey_date, type: "number" },
                { name: BaseSurveyField.health, type: "string" },
                { name: BaseSurveyField.health_have_rehabilitation_access, type: "boolean" },
                { name: BaseSurveyField.health_need_rehabilitation_access, type: "boolean" },
                { name: BaseSurveyField.health_have_assistive_device, type: "boolean" },
                { name: BaseSurveyField.health_working_assistive_device, type: "boolean" },
                { name: BaseSurveyField.health_need_assistive_device, type: "boolean" },
                {
                    name: BaseSurveyField.health_assistive_device_type,
                    type: "string",
                    isOptional: true,
                },
                { name: BaseSurveyField.health_services_satisfaction, type: "string" },
                { name: BaseSurveyField.health_have_mental_condition, type: "boolean" },
                { name: BaseSurveyField.school_currently_attend, type: "boolean" },
                { name: BaseSurveyField.school_grade, type: "number" },
                {
                    name: BaseSurveyField.school_not_attend_reason,
                    type: "string",
                    isOptional: true,
                },
                { name: BaseSurveyField.school_ever_attend, type: "boolean" },
                { name: BaseSurveyField.school_want_attend, type: "boolean" },
                { name: BaseSurveyField.social_community_valued, type: "boolean" },
                { name: BaseSurveyField.social_independent, type: "boolean" },
                { name: BaseSurveyField.social_able_participate, type: "boolean" },
                { name: BaseSurveyField.social_affected_by_disability, type: "boolean" },
                { name: BaseSurveyField.social_discrimination, type: "boolean" },
                { name: BaseSurveyField.work, type: "boolean" },
                { name: BaseSurveyField.work_what, type: "string", isOptional: true },
                { name: BaseSurveyField.work_status, type: "string", isOptional: true },
                { name: BaseSurveyField.work_meet_financial_needs, type: "boolean" },
                { name: BaseSurveyField.work_affected_by_disability, type: "boolean" },
                { name: BaseSurveyField.work_want, type: "boolean" },
                { name: BaseSurveyField.food_security, type: "string" },
                { name: BaseSurveyField.food_enough_monthly, type: "boolean" },
                { name: BaseSurveyField.food_enough_for_child, type: "string", isOptional: true },
                { name: BaseSurveyField.empowerment_organization_member, type: "boolean" },
                {
                    name: BaseSurveyField.empowerment_organization,
                    type: "string",
                    isOptional: true,
                },
                { name: BaseSurveyField.empowerment_rights_awareness, type: "boolean" },
                { name: BaseSurveyField.empowerment_influence_others, type: "boolean" },
                { name: BaseSurveyField.shelter_adequate, type: "boolean" },
                { name: BaseSurveyField.shelter_essential_access, type: "boolean" },
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
                { name: VisitField.nutrit_visit, type: "boolean" },
                { name: VisitField.mental_visit, type: "boolean" },
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
        tableSchema({
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
});
