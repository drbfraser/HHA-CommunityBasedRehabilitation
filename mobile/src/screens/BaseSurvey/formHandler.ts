import { FormikHelpers } from "formik";
import { BaseFormValues } from "@cbr/common/src/forms/BaseSurvey/baseSurveyFields";
import { baseSurveyHandleSubmitForm } from "@cbr/common/src/forms/BaseSurvey/baseSurveyHandler";
import { useNavigation } from "@react-navigation/native";
import { AppStackNavProp } from "../../util/stackScreens";
import { StackScreenName } from "../../util/StackScreenName";
export const handleSubmit = async (
    values: BaseFormValues,
    helpers: FormikHelpers<BaseFormValues>,
    setSubmissionError: React.Dispatch<React.SetStateAction<boolean>>
) => {
    try {
        baseSurveyHandleSubmitForm(values, helpers, setSubmissionError);
    } catch (e) {
        helpers.setSubmitting(false);
        setSubmissionError(true);
    }
};
