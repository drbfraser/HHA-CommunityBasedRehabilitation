// import { FormikHelpers } from "formik";
// import { Endpoint, apiFetch } from "../../util/endpoints";
// import history from "../../util/history";

export const handleSubmit = async () => {
    console.log("Hello world");
};

export const handleCancel = (resetForm: () => void, setIsEditing: (isEditing: boolean) => void) => {
    // TODO: pressing cancel still resets the form
    if (
        window.confirm(
            "Are you sure you want to cancel editing the client?\nClicking OK will not save any edited information."
        )
    ) {
        resetForm();
        setIsEditing(false);
    }
};
