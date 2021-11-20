import { TAlertValues, alertFieldLabels } from "./alertFields";
import { FormikHelpers } from "formik";
import { apiFetch, APIFetchFailError, Endpoint, objectToFormData } from "../../util/endpoints";
import { IAlert } from "../../util/alerts";
import history from "../../util/history";
import { getCurrentUser } from "../../util/hooks/currentUser";

const addAlert = async (alertInfo: FormData): Promise<IAlert> => {
    const init: RequestInit = {
        method: "POST",
        body: alertInfo,
    };


    return await apiFetch(Endpoint.ALERTS, "", init)
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            return res;
        });
};

export const handleNewWebAlertSubmit = async (
    values: TAlertValues,
    helpers: FormikHelpers<TAlertValues>
) => {
    const user = await getCurrentUser();
    console.log("USER is : user");

    /*
    TODO:
    need to keep a parameter showing the userID of the user who is using the system in the top layer.
    Then this userID will be availuable for every page rendered.
  */
    const newAlert = {
        subject: values.subject,
        priority: values.priority,
        alert_message: values.alert_message,
        created_by_user: user,
    };
    console.log(newAlert);
    const formData = objectToFormData(newAlert);
    try {
        const alert: IAlert = await addAlert(formData);
        history.push("/alerts/inbox");
        return alert;
    } catch (e) {
        const initialMessage = "Encountered an error while trying to create the alert!";
        const detailedError =
            e instanceof APIFetchFailError ? e.buildFormError(alertFieldLabels) : `${e}`;
        alert(initialMessage + "\n" + detailedError);
        helpers.setSubmitting(false);
    }
};

export const handleDiscard = (resetForm: () => void) => {
    if (window.confirm("Are you sure you want to clear the form?")) {
        resetForm();
    }
};

/*
TODO:
  Need to discuss with team, maybe save it in the watermelon DB
*/
export const handleSave = async () => {
    // validate the input
    // call backend
};
