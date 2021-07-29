import { FormikHelpers } from "formik";
import { updateCurrentUserPassword } from "../../util/users";
import { APIFetchFailError } from "../../util/endpoints";
import { TPasswordValues } from "./userProfileFields";

const createFailedToGetPasswordError = (reason?: string) => {
    const baseError = "Failed to change password";
    return reason ? baseError + ` (${reason})` : baseError;
};

/**
 * Gets a user-friendly error message from an exception thrown from
 * {@link handleSubmitChangePassword}.
 *
 * @param error The error from {@link handleSubmitChangePassword}, obtained from a `.catch` or try-
 * catch block.
 */
export const getPassChangeErrorMessageFromSubmissionError = (error: any): string => {
    if (error instanceof APIFetchFailError) {
        if (error.status === 400) {
            return "Old password is incorrect";
        } else if (error.details) {
            return createFailedToGetPasswordError(error.details);
        } else {
            return createFailedToGetPasswordError(error.message);
        }
    } else if (error instanceof Error) {
        return createFailedToGetPasswordError(error.message);
    } else if (typeof error === "string") {
        return createFailedToGetPasswordError(error);
    } else {
        return createFailedToGetPasswordError();
    }
};

/**
 * Handles a form submission for a user changing their own password.
 *
 * @return A Promise resolving if the user was successfully able to change their password, and
 * rejecting otherwise. User-friendly messages for users from rejected Promises can be obtained by
 * passing the rejection reason into {@link getPassChangeErrorMessageFromSubmissionError}.
 * @throws APIFetchFailError if the server returned a non-successful response.
 * @param values The old and new password values.
 * @param helpers Form helpers as given in Formik's onSubmit prop.
 */
export const handleSubmitChangePassword = async (
    values: TPasswordValues,
    helpers: FormikHelpers<TPasswordValues>
): Promise<void> => {
    try {
        await updateCurrentUserPassword(values.oldPassword, values.newPassword);
    } catch (e) {
        helpers.setSubmitting(false);
        return Promise.reject(e);
    }
};
