import { FormikHelpers } from "formik";
import { BaseFormValues, BaseSurveyFormField } from "@cbr/common/src/forms/BaseSurvey/baseSurveyFields";
import { baseSurveyHandleSubmitForm } from "@cbr/common/src/forms/BaseSurvey/baseSurveyHandler";
import { dbType } from "../../util/watermelonDatabase";

export const handleSubmit = async (
    values: BaseFormValues,
    database: dbType,
    helpers: FormikHelpers<BaseFormValues>
) => {
    const source = "mobile";
    helpers.setSubmitting(true);

    const surveyInfo = await baseSurveyHandleSubmitForm(values, source);
    await database.write(async () => {
        const client = await database.get("clients").find(values[BaseSurveyFormField.client].toString());
        await database.get("surveys").create((survey: any) => {
            delete surveyInfo.client; /* We want to set this relation ourselves */

            Object.assign(survey, surveyInfo);
            survey.client.set(client);
            survey.survey_date = new Date().getTime();
            survey.created_at = new Date().getTime();
        });
    });
};
