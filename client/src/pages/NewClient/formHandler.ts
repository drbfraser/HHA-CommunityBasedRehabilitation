import { FormikHelpers } from "formik";
import { TFormValues } from "./formFields";
import { Endpoint, apiFetch } from "../../util/endpoints";
import history from "../../util/history";

const addClient = async (clientInfo: string) => {
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
// TODO: Add disability + caregiver name once they are implemented on the back-end.
export const handleSubmit = async (values: TFormValues, helpers: FormikHelpers<TFormValues>) => {
    const newClient = JSON.stringify({
        birth_date: new Date(values.birthDate).getTime() / 1000,
        first_name: values.firstName,
        last_name: values.lastName,
        gender: values.gender,
        phone_number: values.phoneNumber,
        longitude: 0.0,
        latitude: 0.0,
        zone: values.zone,
        village: values.village,
        caregiver_present: values.caregiverPresent,
        // TODO: split caregiver contact to email + phone
        caregiver_phone: values.caregiverPhone,
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
    });

    try {
        const client = await addClient(newClient);
        history.push(`/client/${client.id}`);
    } catch (e) {
        helpers.setSubmitting(false);
    }
};

export const handleReset = (resetForm: () => void) => {
    if (window.confirm("Are you sure you want to clear the form?")) {
        resetForm();
    }
};
