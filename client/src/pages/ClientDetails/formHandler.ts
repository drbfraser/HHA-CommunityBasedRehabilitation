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

export const handleSubmit = async (
    values: IClient,
    helpers: FormikHelpers<IClient>,
    setIsEditing: (isEditing: boolean) => void
) => {
    values = Object.entries(values).reduce((a: any, [k, v]) => (v ? ((a[k] = v), a) : a), {});
    values.birth_date = new Date(values.birth_date).getTime() / 1000;

    const { id, created_by_user, created_date, risks, ...updatedInfo } = values;
    const updatedClient = JSON.stringify(updatedInfo);

    try {
        await updateClient(updatedClient, values.id);
        setIsEditing(false);
        helpers.setSubmitting(false);
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
