import {
    Endpoint,
    apiFetch,
    objectToFormData,
    IClient,
    getDisabilities,
    getOtherDisabilityId,
    APIFetchFailError,
    baseFieldLabels,
} from "@cbr/common";
import { timestampFromFormDate } from "@cbr/common/";
import { Platform, ToastAndroid, AlertIOS } from "react-native";
import { ClientFormFieldLabels } from "./ClientFormFields";

const toastSuccess = () => {
    const msg = "Your changes have been made.";
    if (Platform.OS === "android") {
        ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
        AlertIOS.alert(msg);
    }
};

const updateClient = async (clientInfo: FormData, clientId: number) => {
    const init: RequestInit = {
        method: "PUT",
        body: clientInfo,
    };
    return await apiFetch(Endpoint.CLIENT, `${clientId}`, init)
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            return res;
        })
        .then(() => {
            toastSuccess();
        });
};

export const handleSubmit = async (values: IClient, isNewClient?: boolean) => {
    const disabilities = await getDisabilities();
    let requestSuccess: boolean = true;
    if (isNewClient) {
        //Do the new client POST request stuff here
    } else {
        const updatedValues = {
            first_name: values.first_name,
            last_name: values.last_name,
            birth_date: timestampFromFormDate(values.birth_date as string),
            gender: values.gender,
            phone_number: values.phone_number,
            zone: values.zone,
            village: values.village,
            caregiver_present: values.caregiver_present,
            caregiver_name: values.caregiver_name,
            caregiver_email: values.caregiver_email,
            caregiver_phone: values.caregiver_phone,
            longitude: values.longitude,
            latitude: values.latitude,
            disability: values.disability,
            other_disability: values.disability.includes(getOtherDisabilityId(disabilities))
                ? values.other_disability
                : "",
        };

        const formData = objectToFormData(updatedValues);
        try {
            await updateClient(formData, values.id);
        } catch (e) {
            requestSuccess = false;
            const initialMessage = isNewClient
                ? "Encountered an error while trying to create the client!"
                : "Encountered an error while trying to edit the client!";
            const detailedError =
                e instanceof APIFetchFailError ? e.buildFormError(ClientFormFieldLabels) : `${e}`;
            alert(initialMessage + "\n" + detailedError);
        }
        return requestSuccess;
    }
};
