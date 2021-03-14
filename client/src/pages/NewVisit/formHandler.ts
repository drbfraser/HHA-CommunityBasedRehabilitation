import { TFormValues } from "./formFields";
import { FormikHelpers } from "formik";
import {} from "util/risks";

export const handleSubmit = async (values: TFormValues, helpers: FormikHelpers<TFormValues>) => {
    //const improvements = [];

    // if (values.healthRisk) {
    //     outcomes.push({
    //         risk_type: RiskType.HEALTH,
    //         goal_met: values.healthGoalStatus,
    //         outcome: values.healthOutcome,
    //     });
    //     //values.healthProvided;
    // }
    // if (values.healthRisk) {
    // }
    // if (values.healthRisk) {
    // }

    // const newClient = JSON.stringify({
    //     health: values.healthRisk,
    //     educat: values.educationRisk,
    //     social: values.socialRisk,
    //     outcomes: outcomes,
    //     //improvments: improvements,
    // });

    try {
        //const client = await addClient(newClient);
        //history.push(`/client/${client.id}`);
    } catch (e) {
        helpers.setSubmitting(false);
    }
};
