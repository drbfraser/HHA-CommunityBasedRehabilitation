import { FormikHelpers } from "formik";
import { apiFetch, Endpoint } from "util/endpoints";
import { FormField, TFormValues } from "./formFields";
import history from "../../util/history";

const addReferral = async (referralInfo: string) => {
    const init: RequestInit = {
        method: "POST",
        body: referralInfo,
    };

    return await apiFetch(Endpoint.REFERRALS, "", init)
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            return res;
        });
};

export const handleSubmit = async (values: TFormValues, helpers: FormikHelpers<TFormValues>) => {
    const newReferral = JSON.stringify({
        client: values[FormField.client],
        wheelchair: values[FormField.wheelchair],
        wheelchair_experience: values[FormField.wheelchair]
            ? values[FormField.wheelchairExperience]
            : false,
        hip_width: values[FormField.wheelchair] ? values[FormField.hipWidth] : 0,
        wheelchair_owned: values[FormField.wheelchair] ? values[FormField.wheelchairOwned] : "",
        wheelchair_repairable:
            values[FormField.wheelchair] && values[FormField.wheelchairOwned]
                ? values[FormField.wheelchairRepairable]
                : "",
        physiotherapy: values[FormField.physiotherapy],
        condition: values[FormField.physiotherapy] ? values[FormField.condition] : "",
        prosthetic: values[FormField.prosthetic],
        prosthetic_injury_location: values[FormField.prosthetic]
            ? values[FormField.prostheticInjuryLocation]
            : "",
        orthotic: values[FormField.orthotic],
        orthotic_injury_location: values[FormField.orthotic]
            ? values[FormField.orthoticInjuryLocation]
            : "",
        services_other: values[FormField.servicesOther] ? values[FormField.otherDescription] : "",
    });

    try {
        await addReferral(newReferral);
        history.goBack();
    } catch (e) {
        helpers.setSubmitting(false);
    }
};
