import { BaseSurveyFormField } from "../forms/BaseSurvey/baseSurveyFields";
import i18n from "i18next";


export interface ISurvey {
    id: number;
    survey_date: number;
    health: RateLevel;
    health_have_rehabilitation_access: boolean;
    health_need_rehabilitation_access: boolean;
    health_have_assistive_device: boolean;
    health_have_mental_condition: boolean;
    health_working_assistive_device: boolean;
    health_need_assistive_device: boolean;
    health_services_satisfaction: RateLevel;
    health_assistive_device_type?: DeviceType;
    school_currently_attend: boolean;
    school_grade: number;
    school_not_attend_reason?: ReasonNotSchool;
    school_ever_attend: boolean;
    school_want_attend: boolean;
    social_community_valued: boolean;
    social_independent: boolean;
    social_able_participate: boolean;
    social_affected_by_disability: boolean;
    social_discrimination: boolean;
    work: boolean;
    work_what: string;
    work_status?: IsSelfEmployed;
    work_meet_financial_needs: boolean;
    work_affected_by_disability: boolean;
    work_want: boolean;
    food_security: RateLevel;
    food_enough_monthly: boolean;
    food_enough_for_child?: ChildNourish;
    empowerment_organization_member: boolean;
    empowerment_organization: string;
    empowerment_rights_awareness: boolean;
    empowerment_influence_others: boolean;
    shelter_adequate: boolean;
    shelter_essential_access: boolean;
    client_id: number;
    user_id: number;
}

export enum RateLevel {
    VERY_POOR = "VP",
    POOR = "P",
    FINE = "F",
    GOOD = "G",
}

export enum DeviceType {
    WHEELCHAIR = "WC",
    PROSTHETIC = "PR",
    ORTHOTIC = "OR",
    CRUTCH = "CR",
    WALKING_STICK = "WS",
    HEARING_AID = "HA",
    GLASSES = "GL",
    STANDING_FRAME = "SF",
    CORNER_SEAT = "CS",
}

export enum ReasonNotSchool {
    LACK_OF_FUNDING = "LF",
    MY_DISABILITY_STOPS_ME = "D",
    OTHER = "O",
}

export enum Grade {
    P1 = 1,
    P2 = 2,
    P3 = 3,
    P4 = 4,
    P5 = 5,
    P6 = 6,
    P7 = 7,
    S1 = 8,
    S2 = 9,
    S3 = 10,
    S4 = 11,
    S5 = 12,
    S6 = 13,
}

export enum ChildNourish {
    MALNOURISHED = "M",
    UNDERNOURISHED = "U",
    WELL_NOURISHED = "W",
}

export enum IsSelfEmployed {
    EMPLOYED = "EMPL",
    SELFEMPLOYED = "SEMPL",
}
export interface IRateLevel {
    name: string;
    level: number;
}

// On language change, recompute arrays of labels
export var rateLevel: {[key: string]: {[key:string]:string | number}} = {};
export var deviceTypes: {[key: string]: string} = {};
export var reasonNotSchool: {[key: string]: string} = {};
export var childNourish: {[key: string]: string} = {};
export var isSelfEmployed: {[key: string]: string} = {};
export var grade: {[key: string]: {[key:string]:string | number}} = {};
const refreshArrays = () => {
    rateLevel = {
        [RateLevel.VERY_POOR]: {
            name: i18n.t("survey.veryPoor"),
            level: 1,
        },
        [RateLevel.POOR]: {
            name: i18n.t("survey.poor"),
            level: 2,
        },
        [RateLevel.FINE]: {
            name: i18n.t("survey.fine"),
            level: 3,
        },
        [RateLevel.GOOD]: {
            name: i18n.t("survey.good"),
            level: 4,
        },
    };

    deviceTypes = {
        [DeviceType.WHEELCHAIR]: i18n.t("survey.wheelchair"),
        [DeviceType.PROSTHETIC]: i18n.t("survey.prosthetic"),
        [DeviceType.ORTHOTIC]: i18n.t("survey.orthotic"),
        [DeviceType.CRUTCH]: i18n.t("survey.crutch"),
        [DeviceType.WALKING_STICK]: i18n.t("survey.walkingStick"),
        [DeviceType.HEARING_AID]: i18n.t("survey.hearingAid"),
        [DeviceType.GLASSES]: i18n.t("survey.glasses"),
        [DeviceType.STANDING_FRAME]: i18n.t("survey.standingFrame"),
        [DeviceType.CORNER_SEAT]: i18n.t("survey.cornerSeat"),
    };

    reasonNotSchool = {
        [ReasonNotSchool.LACK_OF_FUNDING]: i18n.t("survey.lackOfFunding"),
        [ReasonNotSchool.MY_DISABILITY_STOPS_ME]: i18n.t("survey.myDisabilityStopsMe"),
        [ReasonNotSchool.OTHER]: i18n.t("survey.other"),
    };
    
    childNourish = {
        [ChildNourish.MALNOURISHED]: i18n.t("survey.malnourished"),
        [ChildNourish.UNDERNOURISHED]: i18n.t("survey.undernourished"),
        [ChildNourish.WELL_NOURISHED]: i18n.t("survey.wellNourished"),
    };
    
    isSelfEmployed = {
        [IsSelfEmployed.EMPLOYED]: i18n.t("survey.employed"),
        [IsSelfEmployed.SELFEMPLOYED]: i18n.t("survey.selfEmployed"),
    };
    
    grade = {
        [Grade.P1]: {
            name: i18n.t("survey.primary1"),
            number: 1,
        },
        [Grade.P2]: {
            name: i18n.t("survey.primary2"),
            number: 2,
        },
        [Grade.P3]: {
            name: i18n.t("survey.primary3"),
            number: 3,
        },
        [Grade.P4]: {
            name: i18n.t("survey.primary4"),
            number: 4,
        },
        [Grade.P5]: {
            name: i18n.t("survey.primary5"),
            number: 5,
        },
        [Grade.P6]: {
            name: i18n.t("survey.primary6"),
            number: 6,
        },
        [Grade.P7]: {
            name: i18n.t("survey.primary7"),
            number: 7,
        },
        [Grade.S1]: {
            name: i18n.t("survey.secondary1"),
            number: 8,
        },
        [Grade.S2]: {
            name: i18n.t("survey.secondary2"),
            number: 9,
        },
        [Grade.S3]: {
            name: i18n.t("survey.secondary3"),
            number: 10,
        },
        [Grade.S4]: {
            name: i18n.t("survey.secondary4"),
            number: 11,
        },
        [Grade.S5]: {
            name: i18n.t("survey.secondary5"),
            number: 12,
        },
        [Grade.S6]: {
            name: i18n.t("survey.secondary6"),
            number: 13,
        },
    };
};
refreshArrays();
i18n.on("languageChanged", () => {
    refreshArrays();
}); 

export const getSurveyInfo = (survey: ISurvey) => {
    return {
        [BaseSurveyFormField.health]: {
            [BaseSurveyFormField.health]: rateLevel[survey.health].name,
            [BaseSurveyFormField.getService]: survey.health_have_rehabilitation_access,
            [BaseSurveyFormField.needService]: survey.health_need_rehabilitation_access,
            [BaseSurveyFormField.mentalHealth]: survey.health_have_mental_condition,
            [BaseSurveyFormField.haveDevice]: survey.health_have_assistive_device,
            [BaseSurveyFormField.deviceWorking]: survey.health_working_assistive_device,
            [BaseSurveyFormField.needDevice]: survey.health_need_assistive_device,
            [BaseSurveyFormField.deviceType]:
                survey.health_assistive_device_type !== undefined
                    ? deviceTypes[survey.health_assistive_device_type]
                    : "",
            [BaseSurveyFormField.serviceSatisf]:
                rateLevel[survey.health_services_satisfaction].name,
        },
        [BaseSurveyFormField.education]: {
            [BaseSurveyFormField.goSchool]: survey.school_currently_attend,
            [BaseSurveyFormField.grade]: grade[survey.school_grade as Grade]?.name ?? "",
            [BaseSurveyFormField.reasonNotSchool]:
                survey.school_not_attend_reason !== undefined
                    ? reasonNotSchool[survey.school_not_attend_reason]
                    : "",
            [BaseSurveyFormField.beenSchool]: survey.school_ever_attend,
            [BaseSurveyFormField.wantSchool]: survey.school_want_attend,
        },
        [BaseSurveyFormField.social]: {
            [BaseSurveyFormField.feelValue]: survey.social_community_valued,
            [BaseSurveyFormField.feelIndependent]: survey.social_independent,
            [BaseSurveyFormField.ableInSocial]: survey.social_able_participate,
            [BaseSurveyFormField.disabiAffectSocial]: survey.social_affected_by_disability,
            [BaseSurveyFormField.disabiDiscrimination]: survey.social_discrimination,
        },
        [BaseSurveyFormField.livelihood]: {
            [BaseSurveyFormField.isWorking]: survey.work,
            [BaseSurveyFormField.job]: survey.work_what,
            [BaseSurveyFormField.isSelfEmployed]:
                survey.work_status !== undefined ? isSelfEmployed[survey.work_status] : "",
            [BaseSurveyFormField.meetFinanceNeeds]: survey.work_meet_financial_needs,
            [BaseSurveyFormField.disabiAffectWork]: survey.work_affected_by_disability,
            [BaseSurveyFormField.wantWork]: survey.work_want,
        },
        [BaseSurveyFormField.foodAndNutrition]: {
            [BaseSurveyFormField.foodSecurityRate]: rateLevel[survey.food_security].name,
            [BaseSurveyFormField.enoughFoodPerMonth]: survey.food_enough_monthly,
            [BaseSurveyFormField.childNourish]:
                survey.food_enough_for_child !== undefined
                    ? childNourish[survey.food_enough_for_child]
                    : "",
        },
        [BaseSurveyFormField.empowerment]: {
            [BaseSurveyFormField.memOfOrgan]: survey.empowerment_organization_member,
            [BaseSurveyFormField.organization]: survey.empowerment_organization,
            [BaseSurveyFormField.awareRight]: survey.empowerment_rights_awareness,
            [BaseSurveyFormField.ableInfluence]: survey.empowerment_influence_others,
        },
        [BaseSurveyFormField.shelterAndCare]: {
            [BaseSurveyFormField.haveShelter]: survey.shelter_adequate,
            [BaseSurveyFormField.accessItem]: survey.shelter_essential_access,
        },
    };
};
