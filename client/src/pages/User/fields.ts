import * as Yup from "yup";

export enum FormField {
    addressInput = "Address",
    emailInput = "emailInput",
    telephoneInput = "telephoneInput",
}

export const fieldLabels = {
    [FormField.addressInput]: "Address (Required)",
    [FormField.emailInput]: "Email Address(Required)",
    [FormField.telephoneInput]: "Telephone(Required)",
};

export const initialValues = {
    [FormField.addressInput]: "British Columbia, Canada",
    [FormField.emailInput]: "XXXXXX@XXX.com",
    [FormField.telephoneInput]: "(XXX) XXX-XXXX",
};

export type TFormValues = typeof initialValues;

export const validationSchema = () =>
    Yup.object().shape({
        [FormField.addressInput]: Yup.string()
            .label(fieldLabels[FormField.addressInput])
            .required(),
        [FormField.emailInput]: Yup.string().label(fieldLabels[FormField.emailInput]).required(),
        [FormField.telephoneInput]: Yup.string()
            .label(fieldLabels[FormField.telephoneInput])
            .required(),
    });
