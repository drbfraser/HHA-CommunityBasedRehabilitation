import * as Yup from "yup";
import { Validation } from "util/validations";
// Field for data get and post connected with database
export enum AdminField {
    username = "username",
    userID = "id",
    firstName = "firstName",
    lastName = "lastName",
    zone = "zone",
    phoneNumber = "phoneNumber",
    type = "type",
    status = "status",
    buttonDisable = "buttonDisable",
}
export const workerOptions = [
    {
        name: "User",
        value: "1",
    },
    {
        name: "Admin",
        value: "2",
    },
    {
        name: "Worker",
        value: "3",
    },
];
export const fieldLabels = {
    [AdminField.username]: "Username",
    [AdminField.userID]: "ID",
    [AdminField.firstName]: "First Name",
    [AdminField.lastName]: "Last Name",
    [AdminField.zone]: "Zone",
    [AdminField.type]: "Type",
    [AdminField.phoneNumber]: "Phone Number",
    [AdminField.status]: "Status",
    [AdminField.buttonDisable]: "Disable Btton",
};

export const initialValues = {
    [AdminField.username]: "Username",
    [AdminField.userID]: "11111111",
    [AdminField.firstName]: "First Name",
    [AdminField.lastName]: "Last Name",
    [AdminField.zone]: "1",
    [AdminField.type]: "Worker",
    [AdminField.status]: "Active",
    [AdminField.phoneNumber]: "(XXX) XXX-XXXX",
    [AdminField.buttonDisable]: "Disable",
};

export type TFormValues = typeof initialValues;

export const validationSchema = () =>
    Yup.object().shape({
        [AdminField.zone]: Yup.string().label(fieldLabels[AdminField.zone]).required(),
        [AdminField.phoneNumber]: Yup.string()
            .matches(Validation.phoneRegExp, "Phone number is not valid")
            .label(fieldLabels[AdminField.phoneNumber])
            .max(50)
            .required(),
        [AdminField.type]: Yup.string().label(fieldLabels[AdminField.zone]).required(),
        [AdminField.status]: Yup.string().label(fieldLabels[AdminField.zone]).required(),
    });
