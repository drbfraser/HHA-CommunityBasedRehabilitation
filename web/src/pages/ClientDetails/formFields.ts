import * as Yup from "yup";
import { Validation } from "@cbr/common/util/validations";
import { IClient } from "@cbr/common/util/clients";

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
    caregiver_email = "caregiver_email",
    caregiver_name = "caregiver_name",
    disability = "disability",
    picture = "picture",
    pictureChanged = "pictureChanged",
    other_disability = "other_disability",
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
    [FormField.caregiver_name]: "Caregiver Name",
    [FormField.caregiver_phone]: "Caregiver Phone Number",
    [FormField.caregiver_email]: "Caregiver Email",
    [FormField.disability]: "Disabilities",
    [FormField.other_disability]: "Other Disabilities",
};

export type TFormValues = IClient & { [FormField.pictureChanged]: boolean };

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
        [FormField.disability]: Yup.array().label(fieldLabels[FormField.disability]).required(),
        [FormField.other_disability]: Yup.string()
            .label(fieldLabels[FormField.other_disability])
            .trim()
            .test(
                "require-if-other-selected",
                "Other Disability is required",
                async (other_disability, schema) =>
                    !(await Validation.otherDisabilitySelected(schema.parent.disability)) ||
                    (other_disability !== undefined && other_disability.length > 0)
            )
            .test(
                "require-if-other-selected",
                "Other Disability must be at most 100 characters",
                async (other_disability, schema) =>
                    !(await Validation.otherDisabilitySelected(schema.parent.disability)) ||
                    (other_disability !== undefined && other_disability.length <= 100)
            ),
        [FormField.gender]: Yup.string().label(fieldLabels[FormField.gender]).required(),
        [FormField.village]: Yup.string().label(fieldLabels[FormField.village]).required(),
        [FormField.zone]: Yup.string().label(fieldLabels[FormField.zone]).required(),
        [FormField.caregiver_name]: Yup.string()
            .label(fieldLabels[FormField.caregiver_name])
            .max(101),
        [FormField.caregiver_phone]: Yup.string()
            .label(fieldLabels[FormField.caregiver_phone])
            .max(50)
            .matches(Validation.phoneRegExp, "Phone number is not valid"),
        [FormField.caregiver_email]: Yup.string()
            .label(fieldLabels[FormField.caregiver_email])
            .max(50)
            .matches(Validation.emailRegExp, "Email Address is not valid"),
    });
