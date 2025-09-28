import { FormikHelpers } from "formik";
import { timestampFromFormDate } from "../../util/dates";
import { apiFetch, APIFetchFailError, Endpoint, objectToFormData } from "../../util/endpoints";
import { getDisabilities, getOtherDisabilityId } from "../../util/hooks/disabilities";
import { clientFieldLabels, TClientValues } from "./clientFields";
import { IClient } from "../../util/clients";
import { appendMobilePict } from "../../util/mobileImageSubmisson";
import i18n from "i18next";
import { OutcomeGoalMet } from "../../util/visits";

const addMobileClient = async (clientInfo: FormData) => {
    const init: RequestInit = {
        method: "POST",
        body: clientInfo,
    };

    console.log(clientInfo);
    return await apiFetch(Endpoint.CLIENTS, "", init).then((res) => res.json());
};

export const handleNewMobileClientSubmit = async (
    values: TClientValues,
    helpers: FormikHelpers<TClientValues>
) => {
    const buildRiskObject = (riskLevel: string, requirement: string, goalName: string) => {
        if (riskLevel && requirement && goalName) {
            console.log("test");
            return {
                risk_level: riskLevel,
                requirement: requirement,
                goal_name: goalName,
                goal_status: OutcomeGoalMet.ONGOING,
            };
        } else {
            return {
                risk_level: "NA",
                requirement: "requirement",
                goal_name: "goal name",
            };
        }
    };

    const disabilities = await getDisabilities();

    const newClient = {
        birth_date: Math.round(timestampFromFormDate(values.birthDate)),
        disability: values.disability,
        other_disability: (values.disability as number[]).includes(
            getOtherDisabilityId(disabilities)
        )
            ? values.otherDisability
            : "",
        first_name: values.firstName,
        last_name: values.lastName,
        gender: values.gender,
        phone_number: values.phoneNumber,
        longitude: 0.0,
        latitude: 0.0,
        zone: values.zone,
        village: values.village,
        caregiver_present: values.caregiverPresent,
        caregiver_name: values.caregiverName,
        caregiver_phone: values.caregiverPhone,
        caregiver_email: values.caregiverEmail,
        health_risk: buildRiskObject(
            values.healthRisk,
            values.healthRequirements,
            values.healthGoals
        ),
        social_risk: buildRiskObject(
            values.socialRisk,
            values.socialRequirements,
            values.socialGoals
        ),
        educat_risk: buildRiskObject(
            values.educationRisk,
            values.educationRequirements,
            values.educationGoals
        ),
        nutrit_risk: buildRiskObject(
            values.nutritionRisk,
            values.nutritionRequirements,
            values.nutritionGoals
        ),
        mental_risk: buildRiskObject(
            values.mentalRisk,
            values.mentalRequirements,
            values.mentalGoals
        ),
    };

    const formData = objectToFormData(newClient);

    if (values.picture) {
        await appendMobilePict(formData, values.picture);
    }

    try {
        const client: IClient = await addMobileClient(formData);
        return client;
    } catch (e) {
        const initialMessage = i18n.t("clientFields.errorCreatingClient");
        const detailedError =
            e instanceof APIFetchFailError ? e.buildFormError(clientFieldLabels) : `${e}`;
        alert(initialMessage + "\n" + detailedError);
        helpers.setSubmitting(false);
    }
};
