import { TPasswordValues } from "./fields";
import { FormikHelpers } from "formik";
import { updateCurrentUserPassword } from "../../util/users";

export const handleSubmitChangePassword = async (
    values: TPasswordValues,
    helpers: FormikHelpers<TPasswordValues>,
    onFinished: (success: boolean) => void
) => {
    try {
        await updateCurrentUserPassword(values.oldPassword, values.newPassword);
        onFinished(true);
    } catch (e) {
        helpers.setSubmitting(false);
        onFinished(false);
    }
};
