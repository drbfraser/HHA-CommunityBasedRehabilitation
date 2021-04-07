import { FormikHelpers } from "formik";
// import { apiFetch, Endpoint } from "util/endpoints";
import { FormField, TFormValues } from "./surveyFormFields";
import history from "util/history";

const addSurvey = async (surveyInfo: string) => {
    // const init: RequestInit = {
    //     method: "POST",
    //     body: surveyInfo,
    // };
    // TODO: connect to the endpoint
    // return await apiFetch(Endpoint.SURVEY, "", init)
    //     .then((res) => {
    //         return res.json();
    //     })
    //     .then((res) => {
    //         return res;
    //     });
};

export const handleSubmit = async (
    values: TFormValues,
    helpers: FormikHelpers<TFormValues>,
    setSubmissionError: React.Dispatch<React.SetStateAction<boolean>>
) => {
    const newSurvey = JSON.stringify({
        // TODO: connedt to the endpoint
        client: values[FormField.client],
    });

    try {
        await addSurvey(newSurvey);
        history.goBack();
    } catch (e) {
        helpers.setSubmitting(false);
        setSubmissionError(true);
    }
};
