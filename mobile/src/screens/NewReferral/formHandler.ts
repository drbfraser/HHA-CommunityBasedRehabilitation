import { ReferralFormField, ReferralFormValues, referralHandleSubmit } from "@cbr/common";
import { FormikHelpers } from "formik";
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
        const client = await database.get("clients").find(values[ReferralFormField.client].toString());
        await database.get("referrals").create((referral: any) => {
            delete referralInfo.client; /* We want to set this relation ourselves */

            Object.assign(referral, referralInfo);
            referral.client.set(client);
            referral.date_referred = new Date().getTime() / 1000;
            referral.created_at = new Date().getTime() / 1000;
        });
    });
};
