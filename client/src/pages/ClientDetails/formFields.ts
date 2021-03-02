import * as Yup from "yup";
import { Validation } from "util/validations";

export enum FormField {
    first_name = "first_name",
    last_name = "last_name",
    birth_date = "birth_date",
    gender = "gender",
    village = "village",
    zone = "zone",
    phone_number = "phone_number",
    caregiver_present = "caregiver_present",
    caregiver_phone = "caregiver_phone",
    // disability = "disability"
}

export const fieldLabels = {
    [FormField.first_name]: "First Name",
    [FormField.last_name]: "Last Name",
    [FormField.birth_date]: "Birthdate",
    [FormField.village]: "Village",
    [FormField.gender]: "Gender",
    [FormField.zone]: "Zone",
    [FormField.phone_number]: "Phone Number",
    [FormField.caregiver_present]: "Caregiver Present?",
    [FormField.caregiver_phone]: "Caregiver Contact",
    // [FormField.disability]: "Type of Disability"
};

export const validationSchema = () =>
    Yup.object().shape({
        [FormField.first_name]: Yup.string()
            .label(fieldLabels[FormField.first_name])
            .required()
            .max(50),
        [FormField.last_name]: Yup.string()
            .label(fieldLabels[FormField.last_name])
            .required()
            .max(50),
        [FormField.birth_date]: Yup.date()
            .label(fieldLabels[FormField.birth_date])
            .max(new Date(), "Birthdate cannot be in the future")
            .required(),
        [FormField.phone_number]: Yup.string()
            .label(fieldLabels[FormField.phone_number])
            .max(50)
            .matches(Validation.phoneRegExp, "Phone number is not valid."),
        [FormField.gender]: Yup.string().label(fieldLabels[FormField.gender]).required(),
        [FormField.village]: Yup.string().label(fieldLabels[FormField.village]).required(),
        [FormField.zone]: Yup.string().label(fieldLabels[FormField.zone]).required(),
        [FormField.caregiver_phone]: Yup.string()
            .label(fieldLabels[FormField.caregiver_phone])
            .max(50)
            .matches(Validation.phoneRegExp, "Phone number is not valid")
            .notOneOf(
                [Yup.ref("phone_number")],
                "Caregiver's phone number should not be the same as the client's phone number."
            ),
    });
