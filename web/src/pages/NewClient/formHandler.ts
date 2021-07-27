import { FormikHelpers } from "formik";
import { fieldLabels, TFormValues } from "./formFields";
import {
    Endpoint,
    apiFetch,
    objectToFormData,
    APIFetchFailError,
} from "@cbr/common//util/endpoints";
import history from "../../util/history";
import { timestampFromFormDate } from "@cbr/common/util/dates";
import { getDisabilities, getOtherDisabilityId } from "@cbr/common/util/hooks/disabilities";
import { getRandomStr } from "@cbr/common/util/misc";

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

// TODO: implement latitude/longitude functionality (Added 0.0 for now as they are required fields in the database.)
export const handleSubmit = async (values: TFormValues, helpers: FormikHelpers<TFormValues>) => {
    const disabilities = await getDisabilities();

    const newClient = {
        birth_date: timestampFromFormDate(values.birthDate),
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
    };

    const formData = objectToFormData(newClient);

    if (values.pictureChanged && values.picture) {
        const pictureResponse = await fetch(values.picture);
        const contentType = pictureResponse.headers.get("Content-Type");

        if (contentType?.startsWith("image/")) {
            formData.append("picture", await pictureResponse.blob(), getRandomStr(30) + ".png");
        }
    }

    try {
        const client = await addClient(formData);
        history.push(`/client/${client.id}`);
    } catch (e) {
        const initialMessage = "Encountered an error while trying to create the client!";
        const detailedError =
            e instanceof APIFetchFailError ? e.buildFormError(fieldLabels) : `${e}`;
        alert(initialMessage + "\n" + detailedError);
        helpers.setSubmitting(false);
    }
};

export const handleReset = (resetForm: () => void) => {
    if (window.confirm("Are you sure you want to clear the form?")) {
        resetForm();
    }
};
