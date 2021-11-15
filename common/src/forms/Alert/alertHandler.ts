import { TAlertValues,alertFieldLabels } from "./alertFields";
import { FormikHelpers } from "formik";
import { apiFetch, APIFetchFailError, Endpoint, objectToFormData } from "../../util/endpoints";
import { IAlert } from "../../util/alerts";
import history from "../../util/history";

/* clientInfo */
const addAlert = async (alertInfo: FormData): Promise<IAlert> => {
  const init: RequestInit = {
      method: "POST",
      body: alertInfo,
  };

  console.log("FLAG --- 2");

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

    // validate the input
    // call backend
    const newAlert = {
      subject: values.subject,
      priority: values.priority,
      alert_message: values.alert_message,
      created_by_user: "1",
    }
    const formData = objectToFormData(newAlert);
    console.log("FLAG --- 4");
    try {
      const alert: IAlert = await addAlert(formData);
      history.push('/alerts/inbox')
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

export const handleSave = async () => {
    // validate the input
    // call backend
};
