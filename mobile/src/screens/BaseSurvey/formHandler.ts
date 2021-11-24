import { FormikHelpers } from "formik";
import {
    BaseFormValues,
    BaseSurveyFormField,
} from "@cbr/common/src/forms/BaseSurvey/baseSurveyFields";
import { baseSurveyHandleSubmitForm } from "@cbr/common/src/forms/BaseSurvey/baseSurveyHandler";
import { modelName } from "../../models/constant";
import { dbType } from "../../util/watermelonDatabase";
import NetInfo, { NetInfoState, NetInfoStateType } from "@react-native-community/netinfo";
import { SyncDB } from "../../util/syncHandler";

export const handleSubmit = async (
    values: BaseFormValues,
    database: dbType,
    helpers: FormikHelpers<BaseFormValues>
) => {
    const source = "mobile";
    helpers.setSubmitting(true);

    const surveyInfo = await baseSurveyHandleSubmitForm(values, source);
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

    NetInfo.fetch().then(async (connectionInfo: NetInfoState) => {
        if (connectionInfo?.type == NetInfoStateType.wifi && connectionInfo?.isInternetReachable) {
            await SyncDB(database);
        }
    });
};
