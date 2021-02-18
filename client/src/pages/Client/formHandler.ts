import { FormikHelpers } from "formik";
import { TFormValues } from "./formFields";

import { addClient } from "../../util/clients";

// TODO: implement latitude/longitude functionality (Added 0.0 for now as they are required fields in the database.)
export const handleSubmit = async (values: TFormValues, helpers: FormikHelpers<TFormValues>) => {
    const newClient = JSON.stringify({
        birth_date: parseInt(values.birthDate.replace(/-/g, "")),
        first_name: values.firstName,
        last_name: values.lastName,
        gender: values.gender,
        phone_number: values.phoneNumber,
        longitude: 0.0,
        latitude: 0.0,
        zone: 1,
        village: "bidibidi #1",
        caregiver_present: values.caregiverPresent,
        // TODO: split caregiver contact to email + phone
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

    await addClient(newClient);
    helpers.setSubmitting(false);

    // TODO: Direct to newly-created client's details page
};

export const handleReset = (resetForm: () => void) => {
    if (window.confirm("Are you sure you want to clear the form?")) {
        resetForm();
    }
};
