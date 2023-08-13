import { IUser, TPasswordValues } from "@cbr/common";
import { TAdminPasswordValues, TNewUserValues } from "@cbr/common/src/forms/Admin/adminFields";
import { FormikHelpers } from "formik";
import { modelName } from "../../models/constant";
import { dbType } from "../../util/watermelonDatabase";
import { AutoSyncDB } from "../../util/syncHandler";

export const handleSelfChangePassword = async (
    userId: string,
    values: TPasswordValues,
    database: dbType,
    helpers: FormikHelpers<TPasswordValues>,
    autoSync: boolean,
    cellularSync: boolean
): Promise<void> => {
    try {
        const user: any = await database.get(modelName.users).find(userId);
        await user.updatePassword(values.newPassword);
        AutoSyncDB(database, autoSync, cellularSync);
    } catch (e) {
        helpers.setSubmitting(false);
        return Promise.reject(e);
    }
};

export const handleUpdatePassword = async (
    userId: string,
    values: TAdminPasswordValues,
    database: dbType,
    helpers: FormikHelpers<TAdminPasswordValues>,
    autoSync: boolean,
    cellularSync: boolean
) => {
    const newPassword = JSON.stringify({
        new_password: values.password,
    });

    try {
        const user: any = await database.get(modelName.users).find(userId);
        await user.updatePassword(values.confirmPassword);
        AutoSyncDB(database, autoSync, cellularSync);
    } finally {
        helpers.setSubmitting(false);
    }
};

export const handleNewUserSubmit = async (
    values: TNewUserValues,
    database: dbType,
    helpers: FormikHelpers<TNewUserValues>,
    autoSync: boolean,
    cellularSync: boolean
) => {
    try {
        let newUser;
        await database.write(async () => {
            newUser = await database.get(modelName.users).create((user: any) => {
                user.username = values.username.toLocaleLowerCase();
                user.password = values.password;
                user.first_name = values.first_name;
                user.last_name = values.last_name;
                user.phone_number = values.phone_number;
                user.role = values.role;
                user.zone = values.zone;
                user.is_active = values.is_active;
            });
        });

        AutoSyncDB(database, autoSync, cellularSync);

        return newUser.id;
    } finally {
        helpers.setSubmitting(false);
    }
};

export const handleUserEditSubmit = async (
    values: IUser,
    database: dbType,
    helpers: FormikHelpers<IUser>,
    autoSync: boolean,
    cellularSync: boolean
) => {
    try {
        let editedUser;
        await database.write(async () => {
            editedUser = await database.get(modelName.users).find(values.id);
            await editedUser.update((user: any) => {
                user.first_name = values.first_name;
                user.last_name = values.last_name;
                user.role = values.role;
                user.phone_number = values.phone_number;
                user.zone = values.zone;
                user.is_active = values.is_active;
            });
        });

        AutoSyncDB(database, autoSync, cellularSync);

        return editedUser.id;
    } finally {
        helpers.setSubmitting(false);
    }
};
