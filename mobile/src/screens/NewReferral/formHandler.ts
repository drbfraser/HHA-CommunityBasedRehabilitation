import { ReferralFormField, ReferralFormValues, referralHandleSubmit } from "@cbr/common";
import { FormikHelpers } from "formik";
import { modelName } from "../../models/constant";
import { dbType } from "../../util/watermelonDatabase";

export const handleSubmit = async (
    values: ReferralFormValues,
    database: dbType,
    helpers: FormikHelpers<ReferralFormValues>
) => {
    const source = "mobile";
    helpers.setSubmitting(true);

    const referralInfo = await referralHandleSubmit(values, source);
    await database.write(async () => {
        const client = await database
            .get(modelName.clients)
            .find(values[ReferralFormField.client_id].toString());
        await database.get(modelName.referrals).create((referral: any) => {
            delete referralInfo.client_id; /* We want to set this relation ourselves */

            Object.assign(referral, referralInfo);
            referral.client.set(client);
            referral.picture = values[ReferralFormField.picture];
            referral.date_referred = new Date().getTime();
        });
    });
};
