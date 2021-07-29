import { BaseSurveyFormField } from "../forms/BaseSurvey/baseSurveyFields";

export interface ISurvey {
    id: number;
    survey_date: number;
    health: RateLevel;
    health_have_rehabilitation_access: boolean;
    health_need_rehabilitation_access: boolean;
    health_have_assistive_device: boolean;
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
    client: number;
    user: number;
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

export const rateLevel = {
    [RateLevel.VERY_POOR]: {
        name: "Very poor",
        level: 1,
    },
    [RateLevel.POOR]: {
        name: "Poor",
        level: 2,
    },
    [RateLevel.FINE]: {
        name: "Fine",
        level: 3,
    },
    [RateLevel.GOOD]: {
        name: "Good",
        level: 4,
    },
};
export const deviceTypes = {
    [DeviceType.WHEELCHAIR]: "Wheelchair",
    [DeviceType.PROSTHETIC]: "Prosthetic",
    [DeviceType.ORTHOTIC]: "Orthotic",
    [DeviceType.CRUTCH]: "Crutch",
    [DeviceType.WALKING_STICK]: "Walking Stick",
    [DeviceType.HEARING_AID]: "Hearing Aid",
    [DeviceType.GLASSES]: "Glasses",
    [DeviceType.STANDING_FRAME]: "Standing Frame",
    [DeviceType.CORNER_SEAT]: "Corner Seat",
};
export const reasonNotSchool = {
    [ReasonNotSchool.LACK_OF_FUNDING]: "Lack of funding",
    [ReasonNotSchool.MY_DISABILITY_STOPS_ME]: "My disability stops me",
    [ReasonNotSchool.OTHER]: "Other",
};

export const childNourish = {
    [ChildNourish.MALNOURISHED]: "Malnourished",
    [ChildNourish.UNDERNOURISHED]: "Undernourished",
    [ChildNourish.WELL_NOURISHED]: "Well-nourished",
};

export const isSelfEmployed = {
    [IsSelfEmployed.EMPLOYED]: "Employed",
    [IsSelfEmployed.SELFEMPLOYED]: "Self-employed",
};

export const grade = {
    [Grade.P1]: {
        name: "Primary 1",
        number: 1,
    },
    [Grade.P2]: {
        name: "Primary 2",
        number: 2,
    },
    [Grade.P3]: {
        name: "Primary 3",
        number: 3,
    },
    [Grade.P4]: {
        name: "Primary 4",
        number: 4,
    },
    [Grade.P5]: {
        name: "Primary 5",
        number: 5,
    },
    [Grade.P6]: {
        name: "Primary 6",
        number: 6,
    },
    [Grade.P7]: {
        name: "Primary 7",
        number: 7,
    },
    [Grade.S1]: {
        name: "Secondary 1",
        number: 8,
    },
    [Grade.S2]: {
        name: "Secondary 2",
        number: 9,
    },
    [Grade.S3]: {
        name: "Secondary 3",
        number: 10,
    },
    [Grade.S4]: {
        name: "Secondary 4",
        number: 11,
    },
    [Grade.S5]: {
        name: "Secondary 5",
        number: 12,
    },
    [Grade.S6]: {
        name: "Secondary 6",
        number: 13,
    },
};

export const getSurveyInfo = (survey: ISurvey) => {
    return {
        [BaseSurveyFormField.health]: {
            [BaseSurveyFormField.health]: rateLevel[survey.health].name,
            [BaseSurveyFormField.getService]: survey.health_have_rehabilitation_access,
            [BaseSurveyFormField.needService]: survey.health_need_rehabilitation_access,
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
