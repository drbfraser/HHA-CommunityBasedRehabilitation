import {
    Endpoint,
    apiFetch,
    objectToFormData,
    getDisabilities,
    getOtherDisabilityId,
    APIFetchFailError,
    clientFieldLabels,
    TClientValues,
} from "@cbr/common";
import { timestampFromFormDate } from "@cbr/common/";
import { appendMobilePict } from "@cbr/common/src/util/mobileImageSubmisson";
import { Platform, ToastAndroid, AlertIOS } from "react-native";
import { dbType } from "../../util/watermelonDatabase";

const toastSuccess = () => {
    const msg = "Your changes have been made.";
    if (Platform.OS === "android") {
        ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
        AlertIOS.alert(msg);
    }
};

export const handleSubmit = async (
    client: any,
    values: TClientValues,
    database: dbType,
    imageChange?: boolean
) => {
    const disabilities = await getDisabilities();
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
    } catch (e) {
        const initialMessage = "Encountered an error while trying to edit the client!";

        alert(initialMessage);
    }
};
