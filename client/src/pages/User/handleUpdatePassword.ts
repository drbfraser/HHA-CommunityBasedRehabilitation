import { FormikHelpers } from "formik";
import { apiFetch, Endpoint } from "util/endpoints";
import history from "util/history";
import { TPasswordValues } from "./fields";

const updateCurrentUserPassword = async (userInfo: string) => {
    const init: RequestInit = {
        method: "PUT",
        body: userInfo,
    };

    const userParams = "";
    return await apiFetch(Endpoint.USER_CURRENT_PASSWORD, userParams, init);
};

export const handleUpdatePassword = () => async (
    values: TPasswordValues,
    helpers: FormikHelpers<TPasswordValues>
) => {
    const passwordInfo = JSON.stringify({
        current_password: values.oldPassword,
        new_password: values.newPassword,
    });

    try {
        await updateCurrentUserPassword(passwordInfo);
        history.goBack();
    } catch (e) {
        alert("The old password you have entered is incorrect. Please try again.");
        helpers.setSubmitting(false);
    }
};

export const handleCancel = () => history.goBack();
