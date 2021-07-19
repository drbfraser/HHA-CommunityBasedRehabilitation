import { Validation } from "@cbr/common";
import * as Yup from "yup";

export interface FormProps {
    isNewClient?: boolean;
    id?: number;
    firstName?: string;
    lastName?: string;
    date?: Date;
    gender?: string;
    village?: string;
    zone?: number;
    phone?: string;
    caregiverPresent?: boolean;
    caregiverName?: string;
    caregiverEmail?: string;
    caregiverPhone?: string;
    clientDisability?: number[];
    otherDisability?: string;
}

export interface FormValues {
    id?: number;
    firstName?: string;
    lastName?: string;
    date?: Date;
    gender?: string;
    village?: string;
    zone?: number;
    phone?: string;
    caregiverPresent?: boolean;
    caregiverName?: string;
    caregiverEmail?: string;
    caregiverPhone?: string;
    clientDisability?: number[];
    otherDisability?: string;
}

export const validationSchema = () =>
    Yup.object().shape({
        ["firstName"]: Yup.string().label("firstName").required().max(50),
        ["lastName"]: Yup.string().label("lastName").required().max(50),
        ["date"]: Yup.date()
            .label("date")
            .max(new Date(), "Birthdate cannot be in the future")
            .required(),
        ["phone"]: Yup.string()
            .label("phone")
            .max(50)
            .matches(Validation.phoneRegExp, "Phone number is not valid."),
        ["clientDisability"]: Yup.array().label("clientDisability").required(),
        ["gender"]: Yup.string().label("gender").required(),
        ["village"]: Yup.string().label("village").required(),
        ["zone"]: Yup.string().label("zone").required(),
        ["caregiverName"]: Yup.string().label("caregiverName").max(101),
        ["caregiverPhone"]: Yup.string()
            .label("caregiverPhone")
            .max(50)
            .matches(Validation.phoneRegExp, "Phone number is not valid"),
        ["caregiverEmail"]: Yup.string()
            .label("caregiverEmail")
            .max(50)
            .matches(Validation.emailRegExp, "Email Address is not valid"),
    });
