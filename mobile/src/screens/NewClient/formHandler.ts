import { getDisabilities, TClientValues } from "@cbr/common";
import { FormikHelpers } from "formik";
import { modelName } from "../../models/constant";
import { StackScreenName } from "../../util/StackScreenName";
import { AppStackNavProp } from "../../util/stackScreens";
import { dbType } from "../../util/watermelonDatabase";

// TODO: profile picture does not upload correctly to server

export const addRisk = async (client: any, database: dbType, type, level, req, goal, time) => {
    const risk = await database.get(modelName.risks).create((risk: any) => {
        risk.client.set(client);
        risk.risk_type = type;
        risk.risk_level = level;
        risk.requirement = req;
        risk.goal = goal;
        risk.timestamp = time;
    });
    return risk;
};

const handleNewMobileClientSubmit = async (
    values: TClientValues,
    helpers: FormikHelpers<TClientValues>,
    database: dbType,
    userID: string
) => {
    const disabilities = await getDisabilities();
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
                client.last_visit_date = 0;
            });
            addRisk(
                newClient,
                database,
                "HEALTH",
                values.healthRisk,
                values.healthRequirements,
                values.healthGoals,
                newClient.createdAt
            );
            addRisk(
                newClient,
                database,
                "SOCIAL",
                values.socialRisk,
                values.socialRequirements,
                values.socialGoals,
                newClient.createdAt
            );
            addRisk(
                newClient,
                database,
                "EDUCAT",
                values.educationRisk,
                values.educationRequirements,
                values.educationGoals,
                newClient.createdAt
            );
        });
        await newClient.newRiskTime();
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
    userID: string
) => {
    helpers.setSubmitting(true);

    return handleNewMobileClientSubmit(values, helpers, database, userID).then((res) => {
        if (res) {
            scrollToTop();
            navigation.navigate(StackScreenName.CLIENT, {
                clientID: res,
            });
            helpers.resetForm();
        }
    });
};
