import { FormikHelpers } from "formik";
import { Endpoint, apiFetch, objectToFormData } from "@cbr/common/util/endpoints";
import { IClient } from "@cbr/common/util/clients";
import { timestampFromFormDate } from "@cbr/common/util/dates";
import { getDisabilities, getOtherDisabilityId } from "@cbr/common/util/hooks/disabilities";
import { getRandomStr } from "@cbr/common/util/misc";

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

export const handleSubmit = async (
    values: IClient,
    helpers: FormikHelpers<IClient>,
    setIsEditing: (isEditing: boolean) => void
) => {
    const disabilities = await getDisabilities();
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

    if (values.picture) {
        const clientProfilePicture = await (await fetch(values.picture)).blob();
        formData.append("picture", clientProfilePicture, getRandomStr(30) + ".png");
    }

    try {
        await updateClient(formData, values.id);
        setIsEditing(false);
    } catch (e) {
        alert("Encountered an error while trying to edit the client!");
    }
    helpers.setSubmitting(false);
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
