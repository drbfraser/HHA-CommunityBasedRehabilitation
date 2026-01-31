import { TAlertValues, alertFieldLabels, TAlertUpdateValues } from "./alertFields";
import { FormikHelpers } from "formik";
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
import i18n from "i18next";

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

const deleteAlert = async (alertId: string, refreshAlert: () => void): Promise<void> => {
    const init: RequestInit = {
        method: "DELETE",
    };
    return await apiFetch(Endpoint.ALERT, `${alertId}`, init).then((res) => {
        if (!res.ok) {
            alert(i18n.t("alerts.errorDeletingAlert"));
        }
        refreshAlert();
    });
};

export const handleNewWebAlertSubmit = async (
    values: TAlertValues,
    helpers: FormikHelpers<TAlertValues>,
) => {
    const user: IUser | typeof APILoadError = await getCurrentUser();
    let newAlert;
    let usersList: string[];
    if (user !== APILoadError) {
        try {
            // Add all users as having unread the alert initially
            let res = await apiFetch(Endpoint.USERS, "");
            let users = await res.json();
            // Reduces list of users to an array of userIDs
            usersList = users.reduce((acc: string, value: IUser) => {
                if (value.id && value.id != user.id) {
                    acc = acc.concat(value.id);
                }
                return acc;
            }, []);
        } catch (e) {
            throw new Error(i18n.t("alerts.errorRetrievingUser", { error: e }));
        }

        newAlert = {
            subject: values.subject,
            priority: values.priority,
            alert_message: values.alert_message,
            unread_by_users: usersList ? usersList : [],
            created_by_user: user.id,
        };
    } else {
        throw new Error(i18n.t("alerts.apiLoadError"));
    }

    const formData = objectToFormData(newAlert);
    try {
        const alert: IAlert = await addAlert(formData);
        history.push("/alerts/inbox");
        socket.emit("newAlert", newAlert); // emit socket event to the backend

        return alert;
    } catch (e) {
        const initialMessage = i18n.t("alerts.errorCreatingAlert");
        const detailedError =
            e instanceof APIFetchFailError ? e.buildFormError(alertFieldLabels) : `${e}`;
        alert(initialMessage + "\n" + detailedError);
        helpers.setSubmitting(false);
    }
};

export const handleDiscard = (resetForm: () => void) => {
    if (window.confirm(i18n.t("alerts.sureToClearForm"))) {
        resetForm();
    }
};

export const handleDeleteAlert = (alertId: string, refreshAlert: () => void) => {
    if (window.confirm(i18n.t("alerts.sureToDeleteAlarm"))) {
        deleteAlert(alertId, refreshAlert);
    }
};

export const handleUpdateAlertSubmit = async (values: TAlertUpdateValues) => {
    try {
        const user: IUser | typeof APILoadError = await getCurrentUser();
        let userID: string = user !== APILoadError ? user.id : i18n.t("alerts.unknownUser");
        // remove this user from the list of unread users
        let updatedUnreadUserList = Object.values(values.unread_by_users).filter(
            (user) => user != userID,
        );

        const updateValues: Partial<IAlert> = {
            subject: values.subject,
            priority: values.priority,
            alert_message: values.alert_message,
            unread_by_users: updatedUnreadUserList,
            created_by_user: values.created_by_user,
        };

        const formData = objectToFormData(updateValues);
        await updateAlert(formData, values.id.toString());
        socket.emit("alertViewed", { ...updateValues, currentUser: userID }); // emit socket event to the backend
    } catch (e) {
        const initialMessage = i18n.t("alerts.errorUpdatingAlert");
        const detailedError =
            e instanceof APIFetchFailError ? e.buildFormError(alertFieldLabels) : `${e}`;
        alert(initialMessage + "\n" + detailedError);
    }
};
