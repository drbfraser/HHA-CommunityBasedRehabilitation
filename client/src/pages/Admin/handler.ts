import { FormikHelpers } from "formik";
import { apiFetch, Endpoint } from "util/endpoints";
import { TFormValues } from "./fields";
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

export const handleSubmit = async (values: TFormValues, helpers: FormikHelpers<TFormValues>) => {
    const newUser = JSON.stringify({
        first_name: values.firstName,
        last_name: values.lastName,
        phone_number: values.phoneNumber,
        zone: values.zone,
        type: values.type,
    });

    try {
        const user = await addUser(newUser);
        history.push(`/admin/${user.id}`);
    } catch (e) {
        helpers.setSubmitting(false);
    }
};

export const handleReset = (resetForm: () => void) => {
    if (window.confirm("Are you sure you want to clear the form?")) {
        resetForm();
    }
};
