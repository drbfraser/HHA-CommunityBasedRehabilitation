import { TNewUserValues } from "@cbr/common/src/forms/Admin/adminFields";
import { FormikHelpers } from "formik";
import { dbType } from "../../util/watermelonDatabase";

export const handleNewUserSubmit = async (
    values: TNewUserValues,
    database: dbType,
    helpers: FormikHelpers<TNewUserValues>
) => {
    try {
        let newUser;
        await database.write(async () => {
            newUser = await database.get("users").create((user: any) => {
                (user.username = values.username),
                    (user.password = values.password),
                    (user.firstName = values.first_name),
                    (user.last_Name = values.last_name),
                    (user.zone = values.zone),
                    (user.role = values.role),
                    (user.isActive = values.is_active);
            });
        });
        return newUser.id;
    } finally {
        helpers.setSubmitting(false);
    }
};
