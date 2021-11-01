import { getDisabilities, TClientValues } from "@cbr/common";
import { FormikHelpers } from "formik";
import { StackScreenName } from "../../util/StackScreenName";
import { AppStackNavProp } from "../../util/stackScreens";
import { database, dbType } from "../../util/watermelonDatabase";

// TODO: profile picture does not upload correctly to server

const addRisk = async (client: any, type, level, req, goal) => {
    await database.get("risks").create((risk: any) => {
        risk.client.set(client);
        risk.risk_type = type;
        risk.risk_level = level;
        risk.requirement = req;
        risk.goal = goal;
    });
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
        const currentUser = await database.get("users").find(userID);
        await database.write(async () => {
            newClient = await database.get("clients").create((client: any) => {
                client.user.set(currentUser);
                client.first_name = values.firstName;
                client.last_name = values.lastName;
                client.full_name = values.firstName + " " + values.lastName;
                client.birth_date = values.birthDate;
                client.gender = values.gender;
                client.phone_number = values.phoneNumber;
                client.disability = values.disability;
                client.other_disability = values.otherDisability;
                client.zone = values.zone;
                client.village = values.village;
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
                "HEALTH",
                values.healthRisk,
                values.healthRequirements,
                values.healthGoals
            );
            addRisk(
                newClient,
                "SOCIAL",
                values.socialRisk,
                values.socialRequirements,
                values.socialGoals
            );
            addRisk(
                newClient,
                "EDUCAT",
                values.educationRisk,
                values.educationRequirements,
                values.educationGoals
            );
        });
        console.log("new client added");
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
    console.log(`submitting these values`);
    console.log(values);
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
