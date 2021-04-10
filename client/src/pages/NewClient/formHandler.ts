import { FormikHelpers } from "formik";
import { TFormValues } from "./formFields";
import { Endpoint, apiFetch } from "../../util/endpoints";
import history from "../../util/history";
import { timestampFromFormDate } from "util/dates";

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

// NOTE: This function does not handle nested objects or arrays of objects.
const objectToFormData = (clientInfo: object) => {
    const formData = new FormData();
    Object.entries(clientInfo).forEach(([key, val]) => {
        if (Array.isArray(val)) {
            val.forEach((v) => formData.append(key, String(v)));
        } else if (typeof val === "object" && val !== null) {
            Object.entries(val).forEach(([objKey, v]) => {
                formData.append(`${key}.${objKey}`, String(v));
            });
        } else {
            formData.append(key, String(val));
        }
    });
    return formData;
};

// TODO: implement latitude/longitude functionality (Added 0.0 for now as they are required fields in the database.)
export const handleSubmit = async (values: TFormValues, helpers: FormikHelpers<TFormValues>) => {
    const newClient = {
        birth_date: timestampFromFormDate(values.birthDate),
        disability: values.disability,
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

    if (values.picture) {
        const clientProfilePicture = await (await fetch(values.picture)).blob();
        formData.append(
            "picture",
            clientProfilePicture,
            Math.random().toString(36).substring(7) + ".png"
        );
    }

    try {
        const client = await addClient(formData);
        history.push(`/client/${client.id}`);
    } catch (e) {
        alert("Encountered an error while trying to create the client!");
        helpers.setSubmitting(false);
    }
};

export const handleReset = (resetForm: () => void, setProfilePicture: (pic: string) => void) => {
    if (window.confirm("Are you sure you want to clear the form?")) {
        resetForm();
        setProfilePicture("/images/profile_pic_icon.png");
    }
};
