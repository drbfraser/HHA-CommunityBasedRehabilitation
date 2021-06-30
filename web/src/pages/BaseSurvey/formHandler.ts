import { FormikHelpers } from "formik";
import { apiFetch, Endpoint } from "@cbr/common/util/endpoints";
import { FormField, TFormValues } from "./formFields";
import history from "util/history";

const addSurvey = async (surveyInfo: string) => {
    const init: RequestInit = {
        method: "POST",
        body: surveyInfo,
    };
    return await apiFetch(Endpoint.BASELINE_SURVEY, "", init)
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            return res;
        });
};

export const handleSubmit = async (
    values: TFormValues,
    helpers: FormikHelpers<TFormValues>,
    setSubmissionError: React.Dispatch<React.SetStateAction<boolean>>
) => {
    const newSurvey = JSON.stringify({
        client: values[FormField.client],
        health: values[FormField.rateLevel],
        health_have_rehabilitation_access: values[FormField.getService],
        health_need_rehabilitation_access: values[FormField.needService],
        health_have_assistive_device: values[FormField.haveDevice],
        health_working_assistive_device: values[FormField.deviceWorking],
        health_need_assistive_device: values[FormField.needDevice],
        health_assistive_device_type: values[FormField.needDevice]
            ? values[FormField.deviceType]
            : "",
        health_services_satisfaction: values[FormField.serviceSatisf],
        school_currently_attend: values[FormField.goSchool],
        school_grade: values[FormField.goSchool] ? values[FormField.grade] : 0,
        school_not_attend_reason: values[FormField.goSchool]
            ? ""
            : values[FormField.reasonNotSchool],
        school_ever_attend: values[FormField.goSchool] ? false : values[FormField.beenSchool],
        school_want_attend: values[FormField.wantSchool],
        social_community_valued: values[FormField.feelValue],
        social_independent: values[FormField.feelIndependent],
        social_able_participate: values[FormField.ableInSocial],
        social_affected_by_disability: values[FormField.disabiAffectSocial],
        social_discrimination: values[FormField.disabiDiscrimination],
        work: values[FormField.isWorking],
        work_what: values[FormField.isWorking] ? values[FormField.job] : "",
        work_status: values[FormField.isWorking] ? values[FormField.isSelfEmployed] : "",
        work_meet_financial_needs: values[FormField.isWorking]
            ? values[FormField.meetFinanceNeeds]
            : false,
        work_affected_by_disability: values[FormField.disabiAffectWork],
        work_want: values[FormField.wantWork],
        food_security: values[FormField.foodSecurityRate],
        food_enough_monthly: values[FormField.enoughFoodPerMonth],
        food_enough_for_child: values[FormField.isChild] ? values[FormField.childNourish] : "",
        empowerment_organization_member: values[FormField.memOfOrgan],
        empowerment_organization: values[FormField.memOfOrgan]
            ? values[FormField.organization]
            : "",
        empowerment_rights_awareness: values[FormField.awareRight],
        empowerment_influence_others: values[FormField.ableInfluence],
        shelter_adequate: values[FormField.haveShelter],
        shelter_essential_access: values[FormField.accessItem],
    });

    try {
        await addSurvey(newSurvey);
        history.goBack();
    } catch (e) {
        helpers.setSubmitting(false);
        setSubmissionError(true);
    }
};
