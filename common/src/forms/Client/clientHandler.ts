import { FormikHelpers } from "formik";
import { timestampFromFormDate } from "../../util/dates";
import { apiFetch, APIFetchFailError, Endpoint, objectToFormData } from "../../util/endpoints";
import { getDisabilities, getOtherDisabilityId } from "../../util/hooks/disabilities";
import { clientFieldLabels, TClientFormValues, TClientValues } from "./clientFields";
import { appendPicture, IClient } from "../../util/clients";
import history from "../../util/history";
import { IUser, UserRole } from "../../util/users";
import i18n from "i18next";

const addClient = async (clientInfo: FormData) => {
    const init: RequestInit = {
        method: "POST",
        body: clientInfo,
    };

    return await apiFetch(Endpoint.CLIENTS, "", init)
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            return res;
        });
};

const updateClient = async (clientInfo: FormData, clientId: string): Promise<IClient> => {
    const init: RequestInit = {
        method: "PUT",
        body: clientInfo,
    };
    return await apiFetch(Endpoint.CLIENT, `${clientId}`, init).then((res) => res.json());
};

export const handleNewWebClientSubmit = async (
    values: TClientValues,
    helpers: FormikHelpers<TClientValues>
) => {
    const disabilities = await getDisabilities();
    const newClient = {
        birth_date: Math.round(timestampFromFormDate(values.birthDate)),
        disability: values.disability,
        other_disability: (values.disability as number[]).includes(
            getOtherDisabilityId(disabilities)
        )
            ? values.otherDisability
            : "",
        first_name: values.firstName,
        last_name: values.lastName,
        gender: values.gender,
        phone_number: values.phoneNumber,
        longitude: 0.0,
        latitude: 0.0,
        zone: values.zone,
        village: values.village,
        hcr_type: values.hcrType,
        caregiver_present: values.caregiverPresent,
        caregiver_name: values.caregiverName,
        caregiver_phone: values.caregiverPhone,
        caregiver_email: values.caregiverEmail,
        health_risk: {
            risk_level: values.healthRisk,
            requirement: values.healthRequirements,
            goal: values.healthGoals,
        },
        social_risk: {
            risk_level: values.socialRisk,
            requirement: values.socialRequirements,
            goal: values.socialGoals,
        },
        educat_risk: {
            risk_level: values.educationRisk,
            requirement: values.educationRequirements,
            goal: values.educationGoals,
        },
        nutrit_risk: {
            risk_level: values.nutritionRisk,
            requirement: values.nutritionRequirements,
            goal: values.nutritionGoals,
        },
        mental_risk: {
            risk_level: values.mentalRisk,
            requirement: values.mentalRequirements,
            goal: values.mentalGoals,
        },
    };

    const formData = objectToFormData(newClient);

    try {
        if (values.pictureChanged && values.picture) {
            await appendPicture(formData, values.picture, null);
        }

        const client: IClient = await addClient(formData);
        history.push(`/client/${client.id}`);
        return client;
    } catch (e) {
        const initialMessage = i18n.t("clientFields.errorCreatingClient");
        const detailedError =
            e instanceof APIFetchFailError ? e.buildFormError(clientFieldLabels) : `${e}`;
        alert(initialMessage + "\n" + detailedError);
        helpers.setSubmitting(false);
    }
};

/**
 * @throws Error if submission fails
 */
export const handleUpdateClientSubmit = async (
    values: TClientFormValues,
    helpers: FormikHelpers<TClientFormValues>,
    setIsEditing: (isEditing: boolean) => void
) => {
    try {
        const disabilities = await getDisabilities();
        const updatedValues: Partial<IClient> = {
            id: values.id,
            user_id: values.user_id,
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
            is_active: values.is_active,
            hcr_type: values.hcr_type,
        };

        const formData = objectToFormData(updatedValues);

        if (values.pictureChanged && values.picture) {
            await appendPicture(formData, values.picture, values.id);
        }

        await updateClient(formData, values.id);
        setIsEditing(false);
    } catch (e) {
        const initialMessage = i18n.t("clientFields.errorEditingClient");
        const detailedError =
            e instanceof APIFetchFailError ? e.buildFormError(clientFieldLabels) : `${e}`;
        alert(initialMessage + "\n" + detailedError);
    } finally {
        helpers.setSubmitting(false);
    }
};

export const handleArchiveConfirmation = (
    values: TClientFormValues,
    user: IUser,
    loadingError: string | undefined
): boolean => {
    if (loadingError) {
        window.alert(i18n.t("clientFields.errorFetching", { loadingError: loadingError }));
    } else if (user.role !== UserRole.ADMIN) {
        window.alert(i18n.t("clientFields.notAuthorizedToArchive"));
    } else {
        // Simplify logic for confirmation dialog construction
        const action = values.is_active
            ? i18n.t("clientFields.archive")
            : i18n.t("clientFields.dearchive");
        const clientActiveError = values.is_active ? i18n.t("clientFields.cannotEditArchived") : "";
        if (
            window.confirm(
                i18n.t("clientFields.sureToArchiveClient", {
                    action: action,
                    first_name: values.first_name,
                    last_name: values.last_name,
                    client_active_error: clientActiveError,
                })
            )
        ) {
            // set is_active
            return !values.is_active;
        }
    }
    return values.is_active;
};

export const handleCancel = (resetForm: () => void, setIsEditing: (isEditing: boolean) => void) => {
    if (window.confirm(i18n.t("clientFields.sureToCancelEditClient"))) {
        resetForm();
        setIsEditing(false);
    }
};

export const handleReset = (resetForm: () => void) => {
    if (window.confirm(i18n.t("clientFields.sureToClearForm"))) {
        resetForm();
    }
};
