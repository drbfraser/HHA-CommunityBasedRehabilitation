import { TFormValues } from "./formFields";
import { FormikHelpers } from "formik";
import { apiFetch, Endpoint } from "util/endpoints";
import history from "../../util/history";

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
export const handleSubmit = async (values: TFormValues, helpers: FormikHelpers<TFormValues>) => {
    const newVisit = JSON.stringify({
        client: values.client,
        health_visit: values.health,
        educat_visit: values.educat,
        social_visit: values.social,
        zone: values.zone,
        village: values.village,
        longitude: 0.0,
        latitude: 0.0,
        improvements: Object.values(values.improvements)
            .reduce((improvements, typedImprovement) => improvements.concat(typedImprovement))
            .filter((improvement) => improvement !== undefined),
        outcomes: Object.values(values.outcomes)
            .map((outcome) => outcome)
            .filter((outcome) => outcome !== undefined),
    });

    console.log(newVisit);

    try {
        await addVisit(newVisit);
        history.push(`/client/${values.client}`);
    } catch (e) {
        helpers.setSubmitting(false);
    }
};
