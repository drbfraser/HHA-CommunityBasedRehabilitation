import { FormikHelpers } from "formik";
import { apiFetch, Endpoint } from "util/endpoints";
import { FormField, TFormValues } from "./surveyFormFields";
import history from "util/history";

const addService = async (surveyInfo: string) => {
    const init: RequestInit = {
        method: "POST",
        body: surveyInfo,
    };

    return await apiFetch(Endpoint.REFERRALS, "", init)
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            return res;
        });
};

export const handleSubmit = async (
    values: TFormValues,
    helpers: FormikHelpers<TFormValues>,
    setSubmissionError: React.Dispatch<React.SetStateAction<boolean>>
) => {
    const newSurvey = JSON.stringify({});

    try {
        await addService(newSurvey);
        history.goBack();
    } catch (e) {
        helpers.setSubmitting(false);
        setSubmissionError(true);
    }
};
