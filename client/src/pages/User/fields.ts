import * as Yup from "yup";
import { Validation } from "util/validations";
// Field for data get and post connected with database
export enum UserField {
    username = "username",
    userID = "id",
    firstName = "firstName",
    lastName = "lastName",
    zone = "zone",
    phoneNumber = "phoneNumber",
}

export const fieldLabels = {
    [UserField.username]: "Username",
    [UserField.firstName]: "First Name",
    [UserField.lastName]: "Last Name",
    [UserField.userID]: "ID",
    [UserField.zone]: "Zone",
    [UserField.phoneNumber]: "Phone Number",
};

export const initialValues = {
    [UserField.username]: "Username",
    [UserField.userID]: "11111111",
    [UserField.firstName]: "First Name",
    [UserField.lastName]: "Last Name",
    [UserField.zone]: "1",
    [UserField.phoneNumber]: "(XXX) XXX-XXXX",
};

export type TFormValues = typeof initialValues;

export const validationSchema = () =>
    Yup.object().shape({
        [UserField.zone]: Yup.string().label(fieldLabels[UserField.zone]).required(),
        [UserField.phoneNumber]: Yup.string()
            .matches(Validation.phoneRegExp, "Phone number is not valid")
            .label(fieldLabels[UserField.phoneNumber])
            .required(),
    });
