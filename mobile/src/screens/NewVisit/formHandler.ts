import { FormikHelpers } from "formik";
import { TVisitFormValues } from "@cbr/common/src/forms/newVisit/visitFormFields";
import { dbType } from "../../util/watermelonDatabase";
import { modelName } from "../../models/constant";
import { AutoSyncDB } from "../../util/syncHandler";

type RiskCode = "HEALTH" | "EDUCAT" | "SOCIAL" | "NUTRIT" | "MENTAL";

const RISK_TYPES: RiskCode[] = ["HEALTH", "EDUCAT", "SOCIAL", "NUTRIT", "MENTAL"];

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
        type Improvement = {
            enabled: boolean;
            provided?: string;
            description?: string;
            risk_type?: RiskCode;
        };

        for (const risk of RISK_TYPES) {
            const enabledForRisk = Array.isArray(values.improvements?.[risk])
                ? (values.improvements[risk] as Improvement[]).filter(
                      (imp) => imp?.enabled === true
                  )
                : [];

            if (!enabledForRisk.length) continue;

            await database.write(async () => {
                for (const imp of enabledForRisk) {
                    await database.get(modelName.improvements).create((rec: any) => {
                        rec.visit.set(visit);
                        rec.risk_type = risk; // matches backend enum values
                        rec.provided = imp.provided ?? ""; // <= 50 chars in backend
                        rec.desc = imp.description ?? ""; // mobile uses "description" in the form
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
