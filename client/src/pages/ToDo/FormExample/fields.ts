import * as Yup from "yup";

export enum FormField {
    textInputRequired = "textInputRequired",
    textInputOptional = "textInputOptional",
    textInputPrefilled = "textInputPrefilled",
    numericInput = "numericInput",
    dropdown = "dropdown",
    checkbox = "checkbox",
    multiLineInput = "multiLineInput",
}

export const fieldLabels = {
    [FormField.textInputRequired]: "Text Input (Required)",
    [FormField.textInputOptional]: "Text Input (Optional)",
    [FormField.textInputPrefilled]: "Text Input (Prefilled)",
    [FormField.numericInput]: "Numeric Input",
    [FormField.dropdown]: "Dropdown",
    [FormField.checkbox]: "Checkbox",
    [FormField.multiLineInput]: "Multi-Line Input",
};

export const initialValues = {
    [FormField.textInputRequired]: "",
    [FormField.textInputOptional]: "",
    [FormField.textInputPrefilled]: "Some text",
    [FormField.numericInput]: "",
    [FormField.dropdown]: "",
    [FormField.checkbox]: false,
    [FormField.multiLineInput]: "",
};

export type TFormValues = typeof initialValues;

export const dropdownOptions = [
    {
        name: "Option 1",
        value: "1",
    },
    {
        name: "Option 2",
        value: "2",
    },
];

export const validationSchema = () =>
    Yup.object().shape({
        [FormField.textInputRequired]: Yup.string()
            .label(fieldLabels[FormField.textInputRequired])
            .required(),
        [FormField.textInputOptional]: Yup.string().label(fieldLabels[FormField.textInputOptional]),
        [FormField.textInputPrefilled]: Yup.string().label(
            fieldLabels[FormField.textInputPrefilled]
        ),
        [FormField.numericInput]: Yup.number()
            .label(fieldLabels[FormField.numericInput])
            .integer()
            .min(10)
            .max(100)
            .label("Numeric Input"),
        [FormField.dropdown]: Yup.string().label(fieldLabels[FormField.dropdown]),
        [FormField.checkbox]: Yup.boolean().label(fieldLabels[FormField.checkbox]),
        [FormField.multiLineInput]: Yup.string().label(fieldLabels[FormField.multiLineInput]),
    });
