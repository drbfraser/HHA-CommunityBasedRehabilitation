import { ImprovementFormField, TVisitFormValues } from "./visitFormFields";
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
    // Sanitize improvements to only send fields accepted by the API
    const sanitizedImprovements = Object.values(values[VisitFormField.improvements])
        .reduce((improvements, typedImprovement) => improvements.concat(typedImprovement), [] as any[])
        .filter(
            (improvement) =>
                improvement !== undefined && improvement[ImprovementFormField.enabled]
        )
        .map((imp) => ({
            risk_type: imp[ImprovementFormField.riskType],
            provided: imp[ImprovementFormField.provided],
            desc: imp[ImprovementFormField.description] ?? "",
        }));

    const newVisit = JSON.stringify({
        client_id: values[VisitFormField.client_id],
        health_visit: values[VisitFormField.health],
        educat_visit: values[VisitFormField.education],
        social_visit: values[VisitFormField.social],
        nutrit_visit: values[VisitFormField.nutrition],
        mental_visit: values[VisitFormField.mental],
        zone: values[VisitFormField.zone],
        village: values[VisitFormField.village],
        longitude: 0.0,
        latitude: 0.0,
        improvements: sanitizedImprovements,
    });

    return await addVisit(newVisit);
};
