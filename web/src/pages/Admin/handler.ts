import { FormikHelpers } from "formik";
import { apiFetch, Endpoint } from "util/endpoints";
import { TNewUserValues, TPasswordValues } from "./fields";
import history from "util/history";
import { IUser } from "util/users";

const addUser = async (userInfo: string) => {
    const init: RequestInit = {
        method: "POST",
        body: userInfo,
    };

    return await apiFetch(Endpoint.USERS, "", init)
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            return res as IUser;
        });
};

const updateUser = async (userInfo: string, userId: number) => {
    const init: RequestInit = {
        method: "PUT",
        body: userInfo,
    };

    return await apiFetch(Endpoint.USER, `${userId}`, init);
};

const updateUserPassword = async (userInfo: string, userId: number) => {
    const init: RequestInit = {
        method: "PUT",
        body: userInfo,
    };

    return await apiFetch(Endpoint.USER_PASSWORD, `${userId}`, init);
};

export const handleUpdatePassword =
    (userId: number) =>
    async (values: TPasswordValues, helpers: FormikHelpers<TPasswordValues>) => {
        const newPassword = JSON.stringify({
            new_password: values.password,
        });

        try {
            await updateUserPassword(newPassword, userId);
            history.goBack();
        } catch (e) {
            alert(
                "Sorry, something went wrong trying to edit that user's password. Please try again."
            );
            helpers.setSubmitting(false);
        }
    };

export const handleNewSubmit = async (
    values: TNewUserValues,
    helpers: FormikHelpers<TNewUserValues>
) => {
    const newUser = JSON.stringify({
        username: values.username,
        password: values.password,
        first_name: values.first_name,
        last_name: values.last_name,
        phone_number: values.phone_number,
        zone: values.zone,
        role: values.role,
        is_active: values.is_active,
    });

    try {
        const user = await addUser(newUser);
        history.replace(`/admin/view/${user.id}`);
    } catch (e) {
        alert(
            `Either a user with that username already exists or that password is too weak. Please try again.`
        );
        helpers.setSubmitting(false);
    }
};

export const handleEditSubmit = async (values: IUser, helpers: FormikHelpers<IUser>) => {
    const editUser = JSON.stringify({
        username: values.username,
        first_name: values.first_name,
        last_name: values.last_name,
        phone_number: values.phone_number,
        zone: values.zone,
        role: values.role,
        is_active: values.is_active,
    });

    try {
        await updateUser(editUser, values.id);
        history.goBack();
    } catch (e) {
        alert("Sorry, something went wrong trying to edit that user. Please try again.");
        helpers.setSubmitting(false);
    }
};

export const handleCancel = () => history.goBack();
