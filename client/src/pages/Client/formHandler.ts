import { FormikHelpers } from "formik";
import { TFormValues } from "./formFields";

import { addClient } from "../../util/clients";

// TODO: implement latitude/longitude functionality (Added 0.0 for now as they are required fields in the database.)
export const handleSubmit = async (values: TFormValues, helpers: FormikHelpers<TFormValues>) => {
    // TODO: make migration to change birthDate + registerDate to DateField instead of BigIntegerField.
    // TODO: zone should be a string, and village should be a number:
    // https://opencoursehub.cs.sfu.ca/bfraser/grav-cms/cmpt373/notes/files/2021-01-18%20HHA%20Initial%20Presentation.pdf
    const birth_date = parseInt(values.birthDate.replace(/-/g, ""));

    const newClient = JSON.stringify({
        client_id: 18,
        created_by_user_id: 1,
        birth_date: birth_date,
        first_name: values.firstName,
        last_name: values.lastName,
        gender: values.gender,
        register_date: 20210216,
        phone_number: values.phoneNumber,
        longitude: 0.0,
        latitude: 0.0,
        zone: 1,
        village: "bidibidi #1",
        caregiver_present: values.caregiverPresent,
    });

    await addClient(newClient);
    helpers.setSubmitting(false);

    // TODO: Direct to newly-created client's details page
    // TODO: Adding Health + Social + Education Risks
};

export const handleReset = (resetForm: () => void) => {
    if (window.confirm("Are you sure you want to clear the form?")) {
        resetForm();
    }
};
