import { TAlertValues, alertFieldLabels } from "./alertFields";
import { FormikHelpers } from "formik";
import { apiFetch, APIFetchFailError, Endpoint, objectToFormData } from "../../util/endpoints";
import { IAlert } from "../../util/alerts";
import history from "../../util/history";
import { socket } from "../../context/SocketIOContext";
import { IUser } from "../../util/users";

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
    /*
    TODO:
    need to keep a parameter showing the userID of the user who is using the system in the top layer.
    Then this userID will be availuable for every page rendered.
  */
    let usersList: string[];
    try {
        // Add all users as having unread the alert initially
        let res = await apiFetch(Endpoint.USERS, "");
        let users = await res.json();
        // Reduces list of users to an array of userIDs
        usersList = users.reduce((acc: string, value: IUser) => {
          if (value.id && value.id != '1') { // TODO: get userID from context instead of hard coding
            acc = acc.concat(value.id)
          }
          return acc
        }, [])

    } catch (e) {
        throw new Error(`Error retreiving users. ${e}`);
    }
    const newAlert = {
        subject: values.subject,
        priority: values.priority,
        alert_message: values.alert_message,
        unread_by_users: usersList ? usersList : [],
        created_by_user: "1", // TODO: get userID from context instead of hard coding
    };

    const formData = objectToFormData(newAlert);
    try {
        const alert: IAlert = await addAlert(formData);
        history.push("/alerts/inbox");
        socket.emit("newAlert", newAlert); // emit socket event to the backend

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
export const handleSave = async (values: any) => {
    // validate the input
    // call backend
};
