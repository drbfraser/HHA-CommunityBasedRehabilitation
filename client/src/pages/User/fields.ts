import * as Yup from "yup";
// https://www.codegrepper.com/code-examples/whatever/phone+number+validation+using+formik
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

// Field for data get and post connected with database
export enum UserField {
    userName = "userName",
    userID = "id",
    zoneNumber = "zoneNumber",
    email = "emailAddress",
    phoneNumber = "phoneNumber",
}

export const fieldLabels = {
    [UserField.userName]: "User Name",
    [UserField.userID]: "ID",
    [UserField.zoneNumber]: "Zone",
    [UserField.email]: "Email",
    [UserField.phoneNumber]: "Phone Number",
};

export const initialValues = {
    [UserField.userName]: "User name",
    [UserField.userID]: "11111111",
    [UserField.zoneNumber]: "1",
    [UserField.email]: "XXXXXX@XXX.com",
    [UserField.phoneNumber]: "(XXX) XXX-XXXX",
};

export type TFormValues = typeof initialValues;

export const validationSchema = () =>
    Yup.object().shape({
        [UserField.zoneNumber]: Yup.string().label(fieldLabels[UserField.zoneNumber]).required(),
        [UserField.email]: Yup.string()
            .matches(emailRegExp, "Email address is not valid")
            .label(fieldLabels[UserField.email])
            .required(),
        [UserField.phoneNumber]: Yup.string()
            .matches(phoneRegExp, "Phone number is not valid")
            .label(fieldLabels[UserField.phoneNumber])
            .required(),
    });
