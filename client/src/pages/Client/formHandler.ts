import { TFormValues } from "./formFields";

import { addClient } from "../../util/clients";

// TODO: implement latitude/longitude functionality (Added 0.0 for now as they are required fields in the database.)
export const handleSubmit = async (
    values: TFormValues,
    setSubmitting: (isSubmitting: boolean) => void
) => {
    const newClient = JSON.stringify({
        birth_date: parseInt(values.birthDate.replace(/-/g, "")),
        first_name: values.firstName,
        last_name: values.lastName,
        gender: values.gender,
        phone_number: values.phoneNumber,
        longitude: 0.0,
        latitude: 0.0,
        zone: values.zone,
        village: values.village,
        caregiver_present: values.caregiverPresent,
        // TODO: split caregiver co1ntact to email + phone
        caregiver_phone: values.caregiverContact,
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

    setSubmitting(false);

    const client = await addClient(newClient);
    return client.id;
};

export const handleReset = (resetForm: () => void) => {
    if (window.confirm("Are you sure you want to clear the form?")) {
        resetForm();
    }
};
