import { FormikHelpers } from "formik";
import { apiFetch, Endpoint } from "../../util/endpoints";
import { IUser } from "../../util/users";
import { TNewUserValues, TAdminPasswordValues } from "./adminFields";

const addUser = async (userInfo: string) => {
    const init: RequestInit = {
        method: "POST",
        body: userInfo,
    };

    return await apiFetch(Endpoint.USERS, "", init)
        .then((res) => res.json())
        .then((res) => res as IUser);
};

const updateUser = async (userInfo: string, userId: string) => {
    const init: RequestInit = {
        method: "PUT",
        body: userInfo,
    };

    return await apiFetch(Endpoint.USER, `${userId}`, init)
        .then((res) => res.json())
        .then((res) => res as IUser);
};

const updateUserPassword = async (userInfo: string, userId: string) => {
    const init: RequestInit = {
        method: "PUT",
        body: userInfo,
    };

    return await apiFetch(Endpoint.USER_PASSWORD, `${userId}`, init);
};

export const handleUpdatePassword = async (
    userId: string,
    values: TAdminPasswordValues,
    helpers: FormikHelpers<TAdminPasswordValues>
) => {
    const newPassword = JSON.stringify({
        new_password: values.password,
    });
    console.log(newPassword);

    try {
        await updateUserPassword(newPassword, userId);
    } finally {
        helpers.setSubmitting(false);
    }
};

/**
 * @return The new user's JSON from the server, which has extra properties filled in such as
 * ID.
 */
export const handleNewUserSubmit = async (
    values: TNewUserValues,
    helpers: FormikHelpers<TNewUserValues>
) => {
    const newUser = JSON.stringify({
        id: "check",
        username: values.username,
        password: values.password,
        first_name: values.first_name,
        last_name: values.last_name,
        phone_number: values.phone_number,
        zone: values.zone,
        role: values.role,
        is_active: values.is_active,
    });
    console.log(newUser);
    try {
        return await addUser(newUser);
    } finally {
        helpers.setSubmitting(false);
    }
};

/**
 * @return The updated user's JSON from the server.
 */
export const handleUserEditSubmit = async (values: IUser, helpers: FormikHelpers<IUser>) => {
    const editUser = JSON.stringify({
        id: values.id,
        username: values.username,
        first_name: values.first_name,
        last_name: values.last_name,
        phone_number: values.phone_number,
        zone: values.zone,
        role: values.role,
        is_active: values.is_active,
    });

    try {
        return await updateUser(editUser, values.id);
    } finally {
        helpers.setSubmitting(false);
    }
};
