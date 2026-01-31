import { FormikHelpers } from "formik";
import {
    ImprovementFormField,
    TVisitFormValues,
    VisitFormField,
} from "@cbr/common/src/forms/newVisit/visitFormFields";
import { dbType } from "../../util/watermelonDatabase";
import { modelName } from "../../models/constant";
import { AutoSyncDB } from "../../util/syncHandler";
import { Q } from "@nozbe/watermelondb";

export const handleSubmit = async (
    values: TVisitFormValues,
    helpers: FormikHelpers<TVisitFormValues>,
    userUsername: string,
    database: dbType,
    autoSync: boolean,
    cellularSync: boolean,
) => {
    helpers.setSubmitting(true);
    try {
        const currentUser = await database
            .get(modelName.users)
            .query(Q.where("username", userUsername))
            .fetch()
            .then((users) => users[0]);
        if (!currentUser) throw new Error("Current user not found: " + userUsername);
        const currentClient: any = await database
            .get(modelName.clients)
            .find(values[VisitFormField.client_id]);

        let visit: any;

        // 1) Create the visit
        await database.write(async () => {
            visit = await database.get(modelName.visits).create((v: any) => {
                v.user.set(currentUser);
                v.client.set(currentClient);
                v.health_visit = !!values.HEALTH;
                v.educat_visit = !!values.EDUCAT;
                v.social_visit = !!values.SOCIAL;
                v.nutrit_visit = !!values.NUTRIT;
                v.mental_visit = !!values.MENTAL;
                v.longitude = "0.0";
                v.latitude = "0.0";
                v.zone = values.zone;
                v.village = values.village;
            });
        });

        // 2) Update client last-visit time
        await currentClient.updateVisitTime(visit.createdAt);

        // 3) Persist enabled improvements only (no outcomes)
        //    values.improvements.<RISK> is an array of { enabled, provided, desc, risk_type }
        const RISK_TYPES = ["HEALTH", "EDUCAT", "SOCIAL", "NUTRIT", "MENTAL"] as const;
        for (const risk of RISK_TYPES) {
            const arr = values.improvements?.[risk] as Array<{ [key: string]: any }> | undefined;
            if (!Array.isArray(arr)) continue;

            const enabledOnly = arr.filter((imp) => imp?.[ImprovementFormField.enabled] === true);

            await database.write(async () => {
                for (const imp of enabledOnly) {
                    await database.get(modelName.improvements).create((rec: any) => {
                        rec.visit.set(visit);
                        rec.risk_type = risk;
                        rec.provided = imp?.[ImprovementFormField.provided] ?? imp?.provided ?? "";
                        rec.desc =
                            imp?.[ImprovementFormField.description] /* "desc" */ ?? imp?.desc ?? "";
                    });
                }
            });
        }

        // 4) Trigger sync if enabled
        AutoSyncDB(database, autoSync, cellularSync);
    } catch (e) {
        helpers.setSubmitting(false);
        throw e;
    }
};
