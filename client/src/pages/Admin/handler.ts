import { FormikHelpers } from "formik";
import { apiFetch, Endpoint } from "util/endpoints";
import { IUser, TFormValues } from "./fields";
import history from "util/history";

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
            return res;
        });
};

const updateUser = async (userInfo: string, userId: number) => {
    const init: RequestInit = {
        method: "PUT",
        body: userInfo,
    };

    return await apiFetch(Endpoint.USER, `${userId}`, init)
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            return res;
        });
};

export const handleNewSubmit = async (values: TFormValues, helpers: FormikHelpers<TFormValues>) => {
    const newUser = JSON.stringify({
        username: values.username,
        password: values.password,
        first_name: values.first_name,
        last_name: values.last_name,
        phone_number: values.phone_number,
        zone: values.zone,
        type: values.type,
        is_active: values.is_active,
    });

    try {
        const user = await addUser(newUser);
        history.push(`/admin/view/${user.id}`);
    } catch (e) {
        alert(
            `Sorry, a user with the username: ${values.username} already exists. Please select a different one.`
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
        type: values.type,
        is_active: values.is_active,
    });

    try {
        await updateUser(editUser, values.id);
        history.push(`/admin/view/${values.id}`);
    } catch (e) {
        alert("Sorry, there is an error while trying to edit the user!");
        helpers.setSubmitting(false);
    }
};

export const handleCancel = () => history.goBack();
