import { BaseSurveyField } from "@cbr/common";
import { mobileGenericField, modelName, tableKey } from "./constant";
import { Model } from "@nozbe/watermelondb";
import { field, date, text, relation, readonly } from "@nozbe/watermelondb/decorators";

export default class BaselineSurvey extends Model {
    static table = "surveys";
    static associations = {
        clients: { type: "belongs_to", key: "client_id" },
        users: { type: "belongs_to", key: "user_id" },
    } as const;

    @field(BaseSurveyField.survey_date) survey_date;
    @text(BaseSurveyField.health) health;
    @field(BaseSurveyField.health_have_rehabilitation_access) health_have_rehabilitation_access;
    @field(BaseSurveyField.health_need_rehabilitation_access) health_need_rehabilitation_access;
    @field(BaseSurveyField.health_have_assistive_device) health_have_assistive_device;
    @field(BaseSurveyField.health_working_assistive_device) health_working_assistive_device;
    @field(BaseSurveyField.health_need_assistive_device) health_need_assistive_device;
    @text(BaseSurveyField.health_assistive_device_type) health_assistive_device_type;
    @text(BaseSurveyField.health_services_satisfaction) health_services_satisfaction;
    @field(BaseSurveyField.school_currently_attend) school_currently_attend;
    @field(BaseSurveyField.school_grade) school_grade;
    @text(BaseSurveyField.school_not_attend_reason) school_not_attend_reason;
    @field(BaseSurveyField.school_ever_attend) school_ever_attend;
    @field(BaseSurveyField.school_want_attend) school_want_attend;
    @field(BaseSurveyField.social_community_valued) social_community_valued;
    @field(BaseSurveyField.social_independent) social_independent;
    @field(BaseSurveyField.social_able_participate) social_able_participate;
    @field(BaseSurveyField.social_affected_by_disability) social_affected_by_disability;
    @field(BaseSurveyField.social_discrimination) social_discrimination;
    @field(BaseSurveyField.work) work;
    @text(BaseSurveyField.work_what) work_what;
    @text(BaseSurveyField.work_status) work_status;
    @field(BaseSurveyField.work_meet_financial_needs) work_meet_financial_needs;
    @field(BaseSurveyField.work_affected_by_disability) work_affected_by_disability;
    @field(BaseSurveyField.work_want) work_want;
    @text(BaseSurveyField.food_security) food_security;
    @field(BaseSurveyField.food_enough_monthly) food_enough_monthly;
    @text(BaseSurveyField.food_enough_for_child) food_enough_for_child;
    @field(BaseSurveyField.empowerment_organization_member) empowerment_organization_member;
    @text(BaseSurveyField.empowerment_organization) empowerment_organization;
    @field(BaseSurveyField.empowerment_rights_awareness) empowerment_rights_awareness;
    @field(BaseSurveyField.empowerment_influence_others) empowerment_influence_others;
    @field(BaseSurveyField.shelter_adequate) shelter_adequate;
    @field(BaseSurveyField.shelter_essential_access) shelter_essential_access;

    @readonly @date(mobileGenericField.created_at) created_at;

    @relation(modelName.clients, tableKey.client_id) client;
    @relation(modelName.users, tableKey.user_id) user;
}
