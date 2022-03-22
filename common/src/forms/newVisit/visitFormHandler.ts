import { ImprovementFormField, TVisitFormValues } from "./visitFormFields";
import { FormikHelpers } from "formik";
import { VisitFormField } from "./visitFormFields";
import { apiFetch, Endpoint } from "../../util/endpoints";

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
export const handleSubmitVisitForm = async (values: TVisitFormValues) => {
    const newVisit = JSON.stringify({
        client_id: values[VisitFormField.client_id],
        health_visit: values[VisitFormField.health],
        educat_visit: values[VisitFormField.education],
        social_visit: values[VisitFormField.social],
        nutrit_visit: values[VisitFormField.nutrition],
        zone: values[VisitFormField.zone],
        village: values[VisitFormField.village],
        longitude: 0.0,
        latitude: 0.0,
        improvements: Object.values(values[VisitFormField.improvements])
            .reduce((improvements, typedImprovement) => improvements.concat(typedImprovement))
            .filter(
                (improvement) =>
                    improvement !== undefined && improvement[ImprovementFormField.enabled]
            ),
        outcomes: Object.values(values[VisitFormField.outcomes]).filter(
            (outcome) => outcome !== undefined
        ),
    });

    return await addVisit(newVisit);
};
