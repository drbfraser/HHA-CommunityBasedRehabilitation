import { FormikHelpers } from "formik";
import { TVisitFormValues } from "@cbr/common/src/forms/newVisit/visitFormFields";
import { dbType } from "../../util/watermelonDatabase";
import { modelName } from "../../models/constant";
import { AutoSyncDB } from "../../util/syncHandler";

export const handleSubmit = async (
    values: TVisitFormValues,
    helpers: FormikHelpers<TVisitFormValues>,
    userID: string,
    database: dbType,
    autoSync: boolean,
    cellularSync: boolean
) => {
    helpers.setSubmitting(true);
    try {
        const currentUser = await database.get(modelName.users).find(userID);
        const currentClient: any = await database.get(modelName.clients).find(values.client);
        let visit;
        await database.write(async () => {
            visit = await database.get(modelName.visits).create((visit: any) => {
                visit.user.set(currentUser);
                visit.client.set(currentClient);
                visit.health_visit = values.HEALTH;
                visit.educat_visit = values.EDUCAT;
                visit.social_visit = values.SOCIAL;
                visit.nutrit_visit = values.NUTRIT;
                visit.mental_visit = values.MENTAL;
                visit.longitude = "0.0";
                visit.latitude = "0.0";
                visit.zone = values.zone;
                visit.village = values.village;
            });
        });
        await currentClient.updateVisitTime(visit.createdAt);
        await visit.addVisitSpec(values.HEALTH, values.improvements.HEALTH, values.outcomes.HEALTH);
        await visit.addVisitSpec(values.EDUCAT, values.improvements.EDUCAT, values.outcomes.EDUCAT);
        await visit.addVisitSpec(values.SOCIAL, values.improvements.SOCIAL, values.outcomes.SOCIAL);
        await visit.addVisitSpec(values.NUTRIT, values.improvements.NUTRIT, values.outcomes.NUTRIT);
        await visit.addVisitSpec(values.MENTAL, values.improvements.MENTAL, values.outcomes.MENTAL);

        AutoSyncDB(database, autoSync, cellularSync);
    } catch (e) {
        helpers.setSubmitting(false);
        throw e;
    }
};
