import { BaseSurveyFields } from "@cbr/common";
import { mobileGenericField, modelName, tableKey } from "./constant";
import { Model } from "@nozbe/watermelondb";
import { field, date, text, readonly, relation } from "@nozbe/watermelondb/decorators";

export default class BaselineSurvey extends Model {
    static table = "surveys";
    static associations = {
        clients: { type: "belongs_to", key: "client_id" },
        users: { type: "belongs_to", key: "user_id" },
    } as const;

    @field(BaseSurveyFields.survey_date) survey_date;
    @text(BaseSurveyFields.health) health;
    @field(BaseSurveyFields.health_have_rehabilitation_access) health_have_rehabilitation_access;
    @field(BaseSurveyFields.health_need_rehabilitation_access) health_need_rehabilitation_access;
    @field(BaseSurveyFields.health_have_assistive_device) health_have_assistive_device;
    @field(BaseSurveyFields.health_working_assistive_device) health_working_assistive_device;
    @field(BaseSurveyFields.health_need_assistive_device) health_need_assistive_device;
    @text(BaseSurveyFields.health_assistive_device_type) health_assistive_device_type;
    @text(BaseSurveyFields.health_services_satisfaction) health_services_satisfaction;
    @field(BaseSurveyFields.school_currently_attend) school_currently_attend;
    @field(BaseSurveyFields.school_grade) school_grade;
    @text(BaseSurveyFields.school_not_attend_reason) school_not_attend_reason;
    @field(BaseSurveyFields.school_ever_attend) school_ever_attend;
    @field(BaseSurveyFields.school_want_attend) school_want_attend;
    @field(BaseSurveyFields.social_community_valued) social_community_valued;
    @field(BaseSurveyFields.social_independent) social_independent;
    @field(BaseSurveyFields.social_able_participate) social_able_participate;
    @field(BaseSurveyFields.social_affected_by_disability) social_affected_by_disability;
    @field(BaseSurveyFields.social_discrimination) social_discrimination;
    @field(BaseSurveyFields.work) work;
    @text(BaseSurveyFields.work_what) work_what;
    @text(BaseSurveyFields.work_status) work_status;
    @field(BaseSurveyFields.work_meet_financial_needs) work_meet_financial_needs;
    @field(BaseSurveyFields.work_affected_by_disability) work_affected_by_disability;
    @field(BaseSurveyFields.work_want) work_want;
    @text(BaseSurveyFields.food_security) food_security;
    @field(BaseSurveyFields.food_enough_monthly) food_enough_monthly;
    @text(BaseSurveyFields.food_enough_for_child) food_enough_for_child;
    @field(BaseSurveyFields.empowerment_organization_member) empowerment_organization_member;
    @text(BaseSurveyFields.empowerment_organization) empowerment_organization;
    @field(BaseSurveyFields.empowerment_rights_awareness) empowerment_rights_awareness;
    @field(BaseSurveyFields.empowerment_influence_others) empowerment_influence_others;
    @field(BaseSurveyFields.shelter_adequate) shelter_adequate;
    @field(BaseSurveyFields.shelter_essential_access) shelter_essential_access;

    @readonly @date(mobileGenericField.created_at) createdAt;

    @relation(modelName.clients, tableKey.client_id) client;
    @relation(modelName.users, tableKey.user_id) user;
}
