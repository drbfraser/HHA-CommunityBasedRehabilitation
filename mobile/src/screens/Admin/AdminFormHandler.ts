import { TNewUserValues } from "@cbr/common/src/forms/Admin/adminFields";
import { FormikHelpers } from "formik";
import { dbType } from "../../util/watermelonDatabase";

export const handleNewUserSubmit = async (
    values: TNewUserValues,
    database: dbType,
    helpers: FormikHelpers<TNewUserValues>
) => {
    try {
        console.log(`zone value is ${values.zone}`);
        let newUser;
        await database.write(async () => {
            newUser = await database.get("users").create((user: any) => {
                (user.username = values.username),
                    (user.password = values.password),
                    (user.first_name = values.first_name),
                    (user.last_name = values.last_name),
                    (user.phone_number = values.phone_number),
                    (user.role = values.role),
                    (user.zone = values.zone),
                    (user.isActive = values.is_active);
            });
        });
        console.log("submitted");
        console.log(newUser);
        return newUser.id;
    } finally {
        helpers.setSubmitting(false);
    }
};
