import { TAlertValues, alertFieldLabels } from "./alertFields";
import { FormikHelpers } from "formik";
import { apiFetch, APIFetchFailError, Endpoint, objectToFormData } from "../../util/endpoints";
import { IAlert } from "../../util/alerts";
import history from "../../util/history";
import { getAuthToken } from "../../util/auth";

declare var require: any;

const axios = require("axios");

const addAlert = async (alertInfo: FormData) => {
    // const addAlert = async (alertInfo: FormData): Promise<IAlert> => {
    // const init: RequestInit = {
    //     method: "POST",
    //     body: alertInfo,
    // };

    // console.log("PLACE 1");

    // return await apiFetch(Endpoint.ALERTS, "", init)
    //     .then((res) => {
    //         console.log("FLAG!!")
    //         return res.json();
    //     })
    //     .then((res) => {
    //         return res;
    //     });

    //let tempAlerts: IAlert[]

    try {
        //    const tempAlerts: IAlert[] = await (await apiFetch(Endpoint.ALERTS)).json();

        const authToken = await getAuthToken();
        if (authToken === null) {
            return Promise.reject("unable to get an access token");
        }

        const tempAlerts = (
            await axios({
                method: "post",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
                url: "http://localhost:8000/api/alert/1",
                body: alertInfo,
            })
        ).data;

        console.log("RESULT: ");
        console.log(tempAlerts);
        //    return tempAlerts;
    } catch (e) {
        console.log(`Error fetching Alerts: ${e}`);
        // return tempAlerts;
    }

    // const init: RequestInit = {
    //     method: "POST",
    //     body: alertInfo,
    // };

    // return await apiFetch(Endpoint.ALERTS, "", init)
    //     .then((res) => {
    //         return res.json();
    //     })
    //     .then((res) => {
    //         return res;
    //     });
};

export const handleNewWebAlertSubmit = async (
    values: TAlertValues,
    helpers: FormikHelpers<TAlertValues>
) => {
    /*
    TODO:
    need to keep a parameter showing the userID of the user who is using the system in the top layer.
    Then this userID will be availuable for every page rendered.
  */
    const newAlert = {
        subject: values.subject,
        priority: values.priority,
        alert_message: values.alert_message,
        created_by_user: "1",
    };
    const formData = objectToFormData(newAlert);
    try {
        // const alert: IAlert = await addAlert(formData);
        await addAlert(formData);
        history.push("/alerts/inbox");
        // return alert;
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
