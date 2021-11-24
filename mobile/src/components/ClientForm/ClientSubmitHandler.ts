import {
    TClientValues,
} from "@cbr/common";
import { dbType } from "../../util/watermelonDatabase";
import NetInfo, { NetInfoState, NetInfoStateType } from "@react-native-community/netinfo";
import { SyncDB } from "../../util/syncHandler";

export const handleSubmit = async (
    client: any,
    values: TClientValues,
    database: dbType,
    imageChange?: boolean
) => {
    try {
        await database.write(async () => {
            await client.update((client) => {
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
            });
        });

        NetInfo.fetch().then((connectionInfo: NetInfoState) => {
            if (connectionInfo?.isInternetReachable && connectionInfo?.type == NetInfoStateType.wifi) {
                SyncDB(database);
            }
        });
    } catch (e) {
        const initialMessage = "Encountered an error while trying to edit the client!";

        alert(initialMessage);
    }
};
