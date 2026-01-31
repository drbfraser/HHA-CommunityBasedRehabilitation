import { FormikHelpers } from "formik";
import {
    BaseFormValues,
    BaseSurveyFormField,
} from "@cbr/common/src/forms/BaseSurvey/baseSurveyFields";
import { baseSurveyHandleSubmitForm } from "@cbr/common/src/forms/BaseSurvey/baseSurveyHandler";
import { modelName } from "../../models/constant";
import { dbType } from "../../util/watermelonDatabase";
import { AutoSyncDB } from "../../util/syncHandler";

export const handleSubmit = async (
    values: BaseFormValues,
    database: dbType,
    helpers: FormikHelpers<BaseFormValues>,
    autoSync: boolean,
    cellularSync: boolean,
) => {
    const source = "mobile";
    helpers.setSubmitting(true);

    const surveyInfo = (await baseSurveyHandleSubmitForm(values, source)) as typeof surveyInfo;

    await database.write(async () => {
        const client = await database
            .get(modelName.clients)
            .find(values[BaseSurveyFormField.client_id].toString());

        await database.get(modelName.surveys).create((survey: any) => {
            delete surveyInfo.client_id; /* We want to set this relation ourselves */

            Object.assign(survey, surveyInfo);
            survey.client.set(client);
            survey.school_grade = parseInt(surveyInfo.school_grade);
            survey.survey_date = new Date().getTime();
        });
    });

    AutoSyncDB(database, autoSync, cellularSync);
};
