import { FormikHelpers } from "formik";
import { TVisitFormValues } from "@cbr/common/src/forms/newVisit/visitFormFields";
import { handleSubmitVisitForm } from "@cbr/common/src/forms/newVisit/visitFormHandler";
import { dbType } from "../../util/watermelonDatabase";

export const handleSubmit = async (
    values: TVisitFormValues,
    helpers: FormikHelpers<TVisitFormValues>,
    userID: string,
    database: dbType
) => {
    helpers.setSubmitting(true);
    try {
        const currentUser = await database.get("users").find(userID);
        const currentClient: any = await database.get("clients").find(values.client);
        let visit;
        await database.write(async () => {
            visit = await database.get("visits").create((visit: any) => {
                visit.user.set(currentUser);
                visit.client.set(currentClient);
                visit.health_visit = values.HEALTH;
                visit.educat_visit = values.EDUCAT;
                visit.social_visit = values.SOCIAL;
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
    } catch (e) {
        helpers.setSubmitting(false);
        throw e;
    }
};
