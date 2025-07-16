import { OutcomeGoalMet, TClientValues } from "@cbr/common";
import { FormikHelpers } from "formik";
import { modelName } from "../../models/constant";
import { StackScreenName } from "../../util/StackScreenName";
import { AppStackNavProp } from "../../util/stackScreens";
import { dbType } from "../../util/watermelonDatabase";
import { AutoSyncDB } from "../../util/syncHandler";

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
    time
) => {
    const risk = await database.get(modelName.risks).create((risk: any) => {
        risk.client.set(client);
        risk.risk_type = type;
        risk.risk_level = level;
        risk.requirement = req;
        risk.goal = goalName;
        risk.goal_name = goalName;
        risk.goal_status = goalStatus;
        risk.cancellation_reason = cancellationReason || "";
        risk.timestamp = time;
        risk.start_date = time;
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
        NONE = "None",
    }
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
                client.health_risk_level = values.healthRisk;
                client.social_risk_level = values.socialRisk;
                client.educat_risk_level = values.educationRisk;
                client.nutrit_risk_level = values.nutritionRisk;
                client.mental_risk_level = values.mentalRisk;
                client.last_visit_date = 0;
                client.is_active = true;
                client.hcr_type = values.hcrType;
            });
            addRisk(
                newClient,
                database,
                "HEALTH",
                values.healthRisk,
                values.healthRequirements,
                values.healthGoals,
                OutcomeGoalMet.NOTSET,
                CancellationReason.NONE,
                newClient.createdAt
            );
            addRisk(
                newClient,
                database,
                "SOCIAL",
                values.socialRisk,
                values.socialRequirements,
                values.socialGoals,
                OutcomeGoalMet.NOTSET,
                CancellationReason.NONE,
                newClient.createdAt
            );
            addRisk(
                newClient,
                database,
                "EDUCAT",
                values.educationRisk,
                values.educationRequirements,
                values.educationGoals,
                OutcomeGoalMet.NOTSET,
                CancellationReason.NONE,
                newClient.createdAt
            );
            addRisk(
                newClient,
                database,
                "NUTRIT",
                values.nutritionRisk,
                values.nutritionRequirements,
                values.nutritionGoals,
                OutcomeGoalMet.NOTSET,
                CancellationReason.NONE,
                newClient.createdAt
            );
            addRisk(
                newClient,
                database,
                "MENTAL",
                values.mentalRisk,
                values.mentalRequirements,
                values.mentalGoals,
                OutcomeGoalMet.NOTSET,
                CancellationReason.NONE,
                newClient.createdAt
            );
        });
        await newClient.newRiskTime();

        AutoSyncDB(database, autoSync, cellularSync);

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
