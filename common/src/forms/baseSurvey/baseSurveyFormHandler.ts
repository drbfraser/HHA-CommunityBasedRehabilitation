import { FormikHelpers } from "formik";
import { apiFetch, Endpoint } from "../../util/endpoints";
import React from "react";
import { BaseSurveyFormField, BaseFormValues } from "./baseSurveyFormFields";

const addSurvey = async (surveyInfo: string) => {
    const init: RequestInit = {
        method: "POST",
        body: surveyInfo,
    };
    return await apiFetch(Endpoint.BASELINE_SURVEY, "", init).then((res) => {
        if (!res.ok) {
            console.error(res.statusText);
            throw Error(res.statusText);
        }
        return res;
    });
};

export const baseSurveyHandleSubmitForm = async (
    values: BaseFormValues,
    helpers: FormikHelpers<BaseFormValues>,
    setSubmissionError: React.Dispatch<React.SetStateAction<boolean>>
) => {
    const newSurvey = JSON.stringify({
        client: values[BaseSurveyFormField.client],
        health: values[BaseSurveyFormField.rateLevel],
        health_have_rehabilitation_access: values[BaseSurveyFormField.getService],
        health_need_rehabilitation_access: values[BaseSurveyFormField.needService],
        health_have_assistive_device: values[BaseSurveyFormField.haveDevice],
        health_working_assistive_device: values[BaseSurveyFormField.deviceWorking],
        health_need_assistive_device: values[BaseSurveyFormField.needDevice],
        health_assistive_device_type: values[BaseSurveyFormField.needDevice]
            ? values[BaseSurveyFormField.deviceType]
            : "",
        health_services_satisfaction: values[BaseSurveyFormField.serviceSatisf],
        school_currently_attend: values[BaseSurveyFormField.goSchool],
        school_grade: values[BaseSurveyFormField.goSchool] ? values[BaseSurveyFormField.grade] : 0,
        school_not_attend_reason: values[BaseSurveyFormField.goSchool]
            ? ""
            : values[BaseSurveyFormField.reasonNotSchool],
        school_ever_attend: values[BaseSurveyFormField.goSchool]
            ? false
            : values[BaseSurveyFormField.beenSchool],
        school_want_attend: values[BaseSurveyFormField.wantSchool],
        social_community_valued: values[BaseSurveyFormField.feelValue],
        social_independent: values[BaseSurveyFormField.feelIndependent],
        social_able_participate: values[BaseSurveyFormField.ableInSocial],
        social_affected_by_disability: values[BaseSurveyFormField.disabiAffectSocial],
        social_discrimination: values[BaseSurveyFormField.disabiDiscrimination],
        work: values[BaseSurveyFormField.isWorking],
        work_what: values[BaseSurveyFormField.isWorking] ? values[BaseSurveyFormField.job] : "",
        work_status: values[BaseSurveyFormField.isWorking]
            ? values[BaseSurveyFormField.isSelfEmployed]
            : "",
        work_meet_financial_needs: values[BaseSurveyFormField.isWorking]
            ? values[BaseSurveyFormField.meetFinanceNeeds]
            : false,
        work_affected_by_disability: values[BaseSurveyFormField.disabiAffectWork],
        work_want: values[BaseSurveyFormField.wantWork],
        food_security: values[BaseSurveyFormField.foodSecurityRate],
        food_enough_monthly: values[BaseSurveyFormField.enoughFoodPerMonth],
        food_enough_for_child: values[BaseSurveyFormField.isChild]
            ? values[BaseSurveyFormField.childNourish]
            : "",
        empowerment_organization_member: values[BaseSurveyFormField.memOfOrgan],
        empowerment_organization: values[BaseSurveyFormField.memOfOrgan]
            ? values[BaseSurveyFormField.organization]
            : "",
        empowerment_rights_awareness: values[BaseSurveyFormField.awareRight],
        empowerment_influence_others: values[BaseSurveyFormField.ableInfluence],
        shelter_adequate: values[BaseSurveyFormField.haveShelter],
        shelter_essential_access: values[BaseSurveyFormField.accessItem],
    });

    try {
        addSurvey(newSurvey);
        // Jump back to client using navigation
    } catch (e) {
        helpers.setSubmitting(false);
        setSubmissionError(true);
    }
};
