import { Endpoint, apiFetch, objectToFormData } from "@cbr/common";
import { timestampFromFormDate } from "@cbr/common/";
import { ClientDTO } from "../../screens/Client/ClientRequests";

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
        });
};

export const handleSubmit = async (values: ClientDTO) => {
    const updatedValues = {
        first_name: values.first_name,
        last_name: values.last_name,
        birth_date: timestampFromFormDate(values.birthdate as string),
        gender: values.gender,
        phone_number: values.phoneNumber,
        zone: values.zone,
        village: values.village,
        caregiver_present: values.careGiverPresent,
        caregiver_name: values.careGiverName,
        caregiver_email: values.careGiverEmail,
        caregiver_phone: values.careGiverPhoneNumber,
        disability: values.disabilities,
        other_disability: values.otherDisability,
    };

    const formData = objectToFormData(updatedValues);
    console.log(formData);
    // if (values.picture) {
    //     const clientProfilePicture = await (await fetch(values.picture)).blob();
    //     formData.append("picture", clientProfilePicture, getRandomStr(30) + ".png");
    // }

    try {
        await updateClient(formData, values.id);
    } catch (e) {
        alert("Encountered an error while trying to edit the client!");
    }
};

export const handleCancel = (resetForm: () => void, setIsEditing: (isEditing: boolean) => void) => {
    if (
        window.confirm(
            "Are you sure you want to cancel editing the client?\nClicking OK will not save any edited information."
        )
    ) {
        resetForm();
        setIsEditing(false);
    }
};
