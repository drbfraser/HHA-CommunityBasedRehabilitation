import * as Yup from "yup";
import { Validation } from "util/validations";

export interface IRouteParams {
    userId: string;
}
export interface IUser {
    id: number;
    zone: number;
    first_name: string;
    last_name: string;
    username: string;
    phone_number: string;
    is_active: boolean;
    // type: string;
}
export enum AdminField {
    username = "username",
    userID = "id",
    firstName = "firstName",
    lastName = "lastName",
    zone = "zone",
    phoneNumber = "phoneNumber",
    type = "type",
    status = "status",
}
export const workerOptions = [
    {
        name: "Admin",
        value: "A",
    },
    {
        name: "Worker",
        value: "W",
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
};
export const initialValues = {
    [AdminField.username]: "Username",
    [AdminField.userID]: "11111111",
    [AdminField.firstName]: "First Name",
    [AdminField.lastName]: "Last Name",
    [AdminField.zone]: "1",
    [AdminField.type]: workerOptions[1].value,
    [AdminField.status]: "Active",
    [AdminField.phoneNumber]: "(XXX) XXX-XXXX",
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
        [AdminField.type]: Yup.string().label(fieldLabels[AdminField.type]).required(),
        [AdminField.status]: Yup.string().label(fieldLabels[AdminField.status]).required(),
    });
