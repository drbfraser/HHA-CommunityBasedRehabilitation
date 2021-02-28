import { FormikHelpers } from "formik";
import { Endpoint, apiFetch } from "../../util/endpoints";

const updateClient = async (clientInfo: string, clientId: number) => {
    const init: RequestInit = {
        method: "PUT",
        body: clientInfo,
    };
    return await apiFetch(Endpoint.CLIENT, `/${clientId}`, init)
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            return res;
        });
};

// TODO: change back to edit button once form is submitted.
// TODO: something to look at : when submit button is on the left, clicking on edit triggers handleSubmit
export const handleSubmit = async (values: any, helpers: FormikHelpers<any>) => {
    const id = values.id;
    values.birth_date = new Date(values.birth_date).getTime() / 1000;

    // TODO: dummy values for latitude & longitude. Should be updated once functionality is implemented.
    values.latitude = 0.0;
    values.longitude = 0.0;

    // TODO: Checking which values have been updated, and using only those values to update client
    // Failure to do so results in 400 HTTP response.
    delete values.risks;
    delete values.id;
    delete values.created_By_user;
    delete values.created_date;
    delete values.picture;
    delete values.caregiver_present;
    delete values.caregiver_phone;
    delete values.caregiver_email;
    delete values.caregiver_picture;

    const updatedClient = JSON.stringify(values);
    console.log(updatedClient);
    await updateClient(updatedClient, id);
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
