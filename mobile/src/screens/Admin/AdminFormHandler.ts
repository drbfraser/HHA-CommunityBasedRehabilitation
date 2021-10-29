import { IUser } from "@cbr/common";
import { TAdminPasswordValues, TNewUserValues } from "@cbr/common/src/forms/Admin/adminFields";
import { FormikHelpers } from "formik";
import { dbType } from "../../util/watermelonDatabase";

export const handleUpdatePassword = async (
    userId: string,
    values: TAdminPasswordValues,
    database: dbType,
    helpers: FormikHelpers<TAdminPasswordValues>
) => {
    const newPassword = JSON.stringify({
        new_password: values.password,
    });

    try {
        const user: any = await database.get("users").find(userId);
        await user.updatePassword(values.confirmPassword);
    } finally {
        helpers.setSubmitting(false);
    }
};

export const handleNewUserSubmit = async (
    values: TNewUserValues,
    database: dbType,
    helpers: FormikHelpers<TNewUserValues>
) => {
    try {
        let newUser;
        await database.write(async () => {
            newUser = await database.get("users").create((user: any) => {
                user.username = values.username;
                user.password = values.password;
                user.first_name = values.first_name;
                user.last_name = values.last_name;
                user.phone_number = values.phone_number;
                user.role = values.role;
                user.zone = values.zone;
                user.isActive = values.is_active;
            });
        });
        console.log("submitted");
        console.log(newUser);
        return newUser.id;
    } finally {
        helpers.setSubmitting(false);
    }
};

export const handleUserEditSubmit = async (
    values: IUser,
    database: dbType,
    helpers: FormikHelpers<IUser>
) => {
    try {
        let editedUser;
        await database.write(async () => {
            editedUser = await database.get("users").find(values.id);
            await editedUser.update((user: any) => {
                user.first_name = values.first_name;
                user.last_name = values.last_name;
                user.role = values.role;
                user.phone_number = values.phone_number;
                user.zone = values.zone;
                user.isActive = values.is_active;
            });
        });
        return editedUser.id;
    } finally {
        helpers.setSubmitting(false);
    }
};
