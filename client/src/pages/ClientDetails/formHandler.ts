import { FormikHelpers } from "formik";
import { Endpoint, apiFetch } from "../../util/endpoints";
import { IClient } from "util/clients";

const updateClient = async (clientInfo: string, clientId: number) => {
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

// TODO: Add disability + caregiver name once they are implemented on the back-end.
export const handleSubmit = async (
    values: IClient,
    helpers: FormikHelpers<IClient>,
    setIsEditing: (isEditing: boolean) => void
) => {
    const updatedValues = JSON.stringify({
        first_name: values.first_name,
        last_name: values.last_name,
        birth_date: new Date(values.birth_date).getTime() / 1000,
        gender: values.gender,
        phone_number: values.phone_number,
        zone: values.zone,
        village: values.village,
        caregiver_present: values.caregiver_present,
        caregiver_phone: values.caregiver_phone,
        longitude: values.longitude,
        latitude: values.latitude,
    });

    try {
        await updateClient(updatedValues, values.id);
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
