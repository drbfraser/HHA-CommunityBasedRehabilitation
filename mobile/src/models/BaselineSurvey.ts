import { Model } from "@nozbe/watermelondb";
import { field, date, text, readonly, relation } from "@nozbe/watermelondb/decorators";

export default class BaselineSurvey extends Model {
    static table = "surveys";
    static associations = {
        clients: { type: "belongs_to", key: "client_id" },
        users: { type: "belongs_to", key: "user_id" },
    } as const;

    @field("survey_date") survey_date;
    @text("health") health;
    @field("health_have_rehabilitation_access") health_have_rehabilitation_access;
    @field("health_need_rehabilitation_access") health_need_rehabilitation_access;
    @field("health_have_assistive_device") health_have_assistive_device;
    @field("health_working_assistive_device") health_working_assistive_device;
    @field("health_need_assistive_device") health_need_assistive_device;
    @text("health_assistive_device_type") health_assistive_device_type;
    @text("health_services_satisfaction") health_services_satisfaction;
    @field("school_currently_attend") school_currently_attend;
    @field("school_grade") school_grade;
    @text("school_not_attend_reason") school_not_attend_reason;
    @field("school_ever_attend") school_ever_attend;
    @field("school_want_attend") school_want_attend;
    @field("social_community_valued") social_community_valued;
    @field("social_independent") social_independent;
    @field("social_able_participate") social_able_participate;
    @field("social_affected_by_disability") social_affected_by_disability;
    @field("social_discrimination") social_discrimination;
    @field("work") work;
    @text("work_what") work_what;
    @text("work_status") work_status;
    @field("work_meet_financial_needs") work_meet_financial_needs;
    @field("work_affected_by_disability") work_affected_by_disability;
    @field("work_want") work_want;
    @text("food_security") food_security;
    @field("food_enough_monthly") food_enough_monthly;
    @text("food_enough_for_child") food_enough_for_child;
    @field("empowerment_organization_member") empowerment_organization_member;
    @text("empowerment_organization") empowerment_organization;
    @field("empowerment_rights_awareness") empowerment_rights_awareness;
    @field("empowerment_influence_others") empowerment_influence_others;
    @field("shelter_adequate") shelter_adequate;
    @field("shelter_essential_access") shelter_essential_access;

    @readonly @date("created_at") createdAt;

    @relation("clients", "client_id") client;
    @relation("users", "user_id") user;
}
