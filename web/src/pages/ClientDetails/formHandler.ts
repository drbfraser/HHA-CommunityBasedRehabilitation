import { FormikHelpers } from "formik";
import {
    apiFetch,
    APIFetchFailError,
    Endpoint,
    objectToFormData,
} from "@cbr/common/util/endpoints";
import { timestampFromFormDate } from "@cbr/common/util/dates";
import { getDisabilities, getOtherDisabilityId } from "@cbr/common/util/hooks/disabilities";
import { TClientFormValues } from "@cbr/common/forms/Client/clientFields";
import { IClient } from "@cbr/common/util/clients";
import { appendPicture } from "../../util/clientSubmission";
import { clientFieldLabels } from "@cbr/common/forms/Client/clientFields";

const updateClient = async (clientInfo: FormData, clientId: number): Promise<IClient> => {
    const init: RequestInit = {
        method: "PUT",
        body: clientInfo,
    };
    return await apiFetch(Endpoint.CLIENT, `${clientId}`, init).then((res) => res.json());
};

/**
 * @throws Error if submission fails
 */
export const handleSubmit = async (
    values: TClientFormValues,
    helpers: FormikHelpers<TClientFormValues>,
    setIsEditing: (isEditing: boolean) => void
) => {
    try {
        const disabilities = await getDisabilities();
        const updatedValues: Partial<IClient> = {
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

        if (values.pictureChanged && values.picture) {
            await appendPicture(formData, values.picture, values.id);
        }

        await updateClient(formData, values.id);
        setIsEditing(false);
    } catch (e) {
        const initialMessage = "Encountered an error while trying to edit the client!";
        const detailedError =
            e instanceof APIFetchFailError ? e.buildFormError(clientFieldLabels) : `${e}`;
        alert(initialMessage + "\n" + detailedError);
    } finally {
        helpers.setSubmitting(false);
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
