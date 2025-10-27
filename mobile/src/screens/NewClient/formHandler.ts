import { OutcomeGoalMet, TClientValues } from "@cbr/common";
import { FormikHelpers } from "formik";
import { modelName } from "../../models/constant";
import { StackScreenName } from "../../util/StackScreenName";
import { AppStackNavProp } from "../../util/stackScreens";
import { dbType } from "../../util/watermelonDatabase";
import { AutoSyncDB } from "../../util/syncHandler";
import { riskDropdownOptions, riskLevels } from "@cbr/common";

// TODO: profile picture does not upload correctly to server

export const addRisk = async (
    client: any,
    database: dbType,
    type,
    level,
    req,
    goalName,
    goalStatus,
    cancellationReason,
    time,
    startDate
) => {
    const risk = await database.get(modelName.risks).create((risk: any) => {
        risk.client.set(client);
        risk.risk_type = type;
        risk.risk_level = level;
        risk.requirement = req;
        risk.goal_name = goalName;
        risk.goal_status = goalStatus;
        risk.cancellation_reason = cancellationReason;
        risk.timestamp = time;
        risk.start_date = startDate;
        risk.end_date =
            goalStatus === OutcomeGoalMet.CANCELLED || goalStatus === OutcomeGoalMet.CONCLUDED
                ? time
                : 0;
    });
    return risk;
};

const handleNewMobileClientSubmit = async (
    values: TClientValues,
    helpers: FormikHelpers<TClientValues>,
    database: dbType,
    userID: string,
    autoSync: boolean,
    cellularSync: boolean
) => {
    enum CancellationReason {
        NONE = "",
    }

    const buildRiskValues = (
        level: string,
        requirementKey: string,
        goalKey: string,
        riskPrefix: keyof typeof riskDropdownOptions
    ) => {
        const requirement =
            riskDropdownOptions[riskPrefix]?.requirement?.[requirementKey] || requirementKey;
        const goal = riskDropdownOptions[riskPrefix]?.goal?.[goalKey] || goalKey;
        return {
            risk_level: level || "NA",
            requirement: requirement || "No requirement",
            goal_name: goal || "No goal",
        };
    };

    try {
        let newClient;
        const currentUser = await database.get(modelName.users).find(userID);
        await database.write(async () => {
            newClient = await database.get(modelName.clients).create((client: any) => {
                client.user.set(currentUser);
                client.first_name = values.firstName;
                client.last_name = values.lastName;
                client.full_name = values.firstName + " " + values.lastName;
                client.birth_date = values.birthDate;
                client.gender = values.gender;
                client.phone_number = values.phoneNumber;
                client.longitude = "0.0";
                client.latitude = "0.0";
                client.disability = values.disability;
                client.other_disability = values.otherDisability;
                client.zone = values.zone;
                client.village = values.village;
                client.picture = values.picture;
                client.caregiver_present = values.caregiverPresent;
                client.caregiver_name = values.caregiverName;
                client.caregiver_phone = values.caregiverPhone;
                client.caregiver_email = values.caregiverEmail;
                client.health_risk_level =
                    values.healthRisk && values.healthRisk.trim() !== "" ? values.healthRisk : "NA";
                client.social_risk_level =
                    values.socialRisk && values.socialRisk.trim() !== "" ? values.socialRisk : "NA";
                client.educat_risk_level =
                    values.educationRisk && values.educationRisk.trim() !== ""
                        ? values.educationRisk
                        : "NA";
                client.nutrit_risk_level =
                    values.nutritionRisk && values.nutritionRisk.trim() !== ""
                        ? values.nutritionRisk
                        : "NA";
                client.mental_risk_level =
                    values.mentalRisk && values.mentalRisk.trim() !== "" ? values.mentalRisk : "NA";
                client.last_visit_date = 0;
                client.is_active = true;
                client.hcr_type = values.hcrType;
            });

            const health = buildRiskValues(
                values.healthRisk,
                values.healthRequirements,
                values.healthGoals,
                "health"
            );

            await addRisk(
                newClient,
                database,
                "HEALTH",
                health.risk_level,
                health.requirement,
                health.goal_name,
                health.risk_level == "NA" ? OutcomeGoalMet.CONCLUDED : OutcomeGoalMet.ONGOING,
                CancellationReason.NONE,
                newClient.createdAt,
                newClient.createdAt
            );

            const social = buildRiskValues(
                values.socialRisk,
                values.socialRequirements,
                values.socialGoals,
                "social"
            );

            await addRisk(
                newClient,
                database,
                "SOCIAL",
                social.risk_level,
                social.requirement,
                social.goal_name,
                social.risk_level == "NA" ? OutcomeGoalMet.CONCLUDED : OutcomeGoalMet.ONGOING,
                CancellationReason.NONE,
                newClient.createdAt,
                newClient.createdAt
            );

            const educat = buildRiskValues(
                values.educationRisk,
                values.educationRequirements,
                values.educationGoals,
                "education"
            );
            await addRisk(
                newClient,
                database,
                "EDUCAT",
                educat.risk_level,
                educat.requirement,
                educat.goal_name,
                educat.risk_level == "NA" ? OutcomeGoalMet.CONCLUDED : OutcomeGoalMet.ONGOING,
                CancellationReason.NONE,
                newClient.createdAt,
                newClient.createdAt
            );

            const nutrit = buildRiskValues(
                values.nutritionRisk,
                values.nutritionRequirements,
                values.nutritionGoals,
                "nutrition"
            );
            await addRisk(
                newClient,
                database,
                "NUTRIT",
                nutrit.risk_level,
                nutrit.requirement,
                nutrit.goal_name,
                nutrit.risk_level == "NA" ? OutcomeGoalMet.CONCLUDED : OutcomeGoalMet.ONGOING,
                CancellationReason.NONE,
                newClient.createdAt,
                newClient.createdAt
            );

            const mental = buildRiskValues(
                values.mentalRisk,
                values.mentalRequirements,
                values.mentalGoals,
                "mental"
            );
            await addRisk(
                newClient,
                database,
                "MENTAL",
                mental.risk_level,
                mental.requirement,
                mental.goal_name,
                mental.risk_level == "NA" ? OutcomeGoalMet.CONCLUDED : OutcomeGoalMet.ONGOING,
                CancellationReason.NONE,
                newClient.createdAt,
                newClient.createdAt
            );
        });

        await newClient.newRiskTime();
        await AutoSyncDB(database, autoSync, cellularSync);

        return newClient.id;
    } catch (e) {
        console.log(e);
        const initialMessage = "Encountered an error while trying to create the client!";
        alert(initialMessage + "\n");
        helpers.setSubmitting(false);
    }
};

export const handleSubmit = async (
    values: TClientValues,
    helpers: FormikHelpers<TClientValues>,
    navigation: AppStackNavProp,
    scrollToTop: () => void,
    database: dbType,
    userID: string,
    autoSync: boolean,
    cellularSync: boolean
) => {
    helpers.setSubmitting(true);

    return handleNewMobileClientSubmit(
        values,
        helpers,
        database,
        userID,
        autoSync,
        cellularSync
    ).then((res) => {
        if (res) {
            scrollToTop();
            navigation.navigate(StackScreenName.CLIENT, {
                clientID: res,
            });
            helpers.resetForm();
        }
    });
};
