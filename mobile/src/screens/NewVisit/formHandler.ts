import { ImprovementFormField, TFormValues } from "./formFields";
import { FormikHelpers } from "formik";
import { FormField } from "./formFields";
import { apiFetch, Endpoint } from "@cbr/common";

const addVisit = async (visitInfo: string) => {
    const init: RequestInit = {
        method: "POST",
        body: visitInfo,
    };

    return await apiFetch(Endpoint.VISITS, "", init)
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            return res;
        });
};

// TODO: implement latitude/longitude functionality (Added 0.0 for now as they are required fields in the database.)
export const handleSubmit = async (
    values: TFormValues,
    helpers: FormikHelpers<TFormValues>,
    setSubmissionError: React.Dispatch<React.SetStateAction<boolean>>
) => {
    const newVisit = JSON.stringify({
        client: values[FormField.client],
        health_visit: values[FormField.health],
        educat_visit: values[FormField.education],
        social_visit: values[FormField.social],
        zone: values[FormField.zone],
        village: values[FormField.village],
        longitude: 0.0,
        latitude: 0.0,
        improvements: Object.values(values[FormField.improvements])
            .reduce((improvements, typedImprovement) => improvements.concat(typedImprovement))
            .filter(
                (improvement) =>
                    improvement !== undefined && improvement[ImprovementFormField.enabled]
            ),
        outcomes: Object.values(values[FormField.outcomes]).filter(
            (outcome) => outcome !== undefined
        ),
    });

    try {
        await addVisit(newVisit);
        // history.goBack();
    } catch (e) {
        helpers.setSubmitting(false);
        setSubmissionError(true);
    }
};
