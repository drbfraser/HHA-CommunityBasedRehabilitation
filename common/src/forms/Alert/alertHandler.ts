import { TAlertValues, alertFieldLabels, TAlertUpdateValues } from "./alertFields";
import { FormikHelpers, validateYupSchema } from "formik";
import {
    apiFetch,
    APIFetchFailError,
    APILoadError,
    Endpoint,
    objectToFormData,
} from "../../util/endpoints";
import { IAlert } from "../../util/alerts";
import history from "../../util/history";
import { socket } from "../../context/SocketIOContext";
import { IUser } from "../../util/users";
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

const updateAlert = async (alertInfo: FormData, alertId: string): Promise<IAlert> => {
    const init: RequestInit = {
        method: "PUT",
        body: alertInfo,
    };
    return await apiFetch(Endpoint.ALERT, `${alertId}`, init).then((res) => res.json());
};

export const handleNewWebAlertSubmit = async (
    values: TAlertValues,
    helpers: FormikHelpers<TAlertValues>
) => {
    let user = await getCurrentUser();
    let userID: string = user !== APILoadError ? user.id : "unknown";

    let usersList: string[];
    try {
        // Add all users as having unread the alert initially
        let res = await apiFetch(Endpoint.USERS, "");
        let users = await res.json();
        // Reduces list of users to an array of userIDs
        usersList = users.reduce((acc: string, value: IUser) => {
            if (value.id && value.id != userID) {
                acc = acc.concat(value.id);
            }
            return acc;
        }, []);
    } catch (e) {
        throw new Error(`Error retreiving users. ${e}`);
    }

    const newAlert = {
        subject: values.subject,
        priority: values.priority,
        alert_message: values.alert_message,
        unread_by_users: usersList ? usersList : [],
        created_by_user: userID,
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

export const handleUpdateAlertSubmit = async (values: TAlertUpdateValues) => {
    try {
        let user = await getCurrentUser();
        let userID: string = user !== APILoadError ? user.id : "unknown";
        // remove this user from the list of unread users
        let list = values.unread_by_users;
        let updatedUnreadUserList = Object.values(values.unread_by_users).filter(
            (user) => user != userID
        );

        const updateValues: Partial<IAlert> = {
            subject: values.subject,
            priority: values.priority,
            alert_message: values.alert_message,
            unread_by_users: updatedUnreadUserList.toString(),
            created_by_user: values.created_by_user,
        };

        const formData = objectToFormData(updateValues);
        await updateAlert(formData, values.id);
        socket.emit("alertViewed", updateValues); // emit socket event to the backend

    } catch (e) {
        const initialMessage = "Encountered an error while trying to update the alert!";
        const detailedError =
            e instanceof APIFetchFailError ? e.buildFormError(alertFieldLabels) : `${e}`;
        alert(initialMessage + "\n" + detailedError);
    }
};
