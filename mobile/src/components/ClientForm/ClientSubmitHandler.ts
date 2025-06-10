import { TClientValues } from "@cbr/common";
import { dbType } from "../../util/watermelonDatabase";
import { AutoSyncDB } from "../../util/syncHandler";
import i18n from "i18next";

export const handleSubmit = async (
    client: any,
    values: TClientValues,
    database: dbType,
    autoSync: boolean,
    cellularSync: boolean,
    imageChange?: boolean
) => {
    try {
        await database.write(async () => {
            await client.update(() => {
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
                client.picture = values.picture;
                client.caregiver_present = values.caregiverPresent;
                client.caregiver_name = values.caregiverName;
                client.caregiver_phone = values.caregiverPhone;
                client.caregiver_email = values.caregiverEmail;
                client.is_active = values.is_active;
            });
        });

        AutoSyncDB(database, autoSync, cellularSync);
    } catch (e) {
        const initialMessage = i18n.t("alert.actionFailure", {
            action: i18n.t("general.edit"),
            object: i18n.t("general.client"),
        });
        alert(initialMessage);
    }
};
