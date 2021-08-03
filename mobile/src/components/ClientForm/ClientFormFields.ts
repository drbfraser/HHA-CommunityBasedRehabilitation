import { IReferral, IRisk, ISurvey, IVisit, IVisitSummary, Validation } from "@cbr/common";
import { FormikProps } from "formik";
import * as Yup from "yup";

/*export const validationSchema = () =>
    Yup.object().shape({
        [ClientFields.first_name]: Yup.string()
            .label(ClientFormFieldLabels[ClientFormFields.first_name])
            .required()
            .max(50)
            .min(1),
        [ClientFormFields.last_name]: Yup.string()
            .label(ClientFormFieldLabels[ClientFormFields.last_name])
            .required()
            .max(50)
            .min(1),
        [ClientFormFields.birthDate]: Yup.date()
            .label(ClientFormFieldLabels[ClientFormFields.birthDate])
            .max(new Date(), "Birthdate cannot be in the future")
            .required(),
        [ClientFormFields.phone]: Yup.string()
            .label(ClientFormFieldLabels[ClientFormFields.phone])
            .max(50)
            .matches(Validation.phoneRegExp, "Phone number is not valid."),
        [ClientFormFields.disability]: Yup.array()
            .label(ClientFormFieldLabels[ClientFormFields.disability])
            .required()
            .min(1, "You must input at least 1 disability"),
        [ClientFormFields.gender]: Yup.string()
            .label(ClientFormFieldLabels[ClientFormFields.gender])
            .required(),
        [ClientFormFields.village]: Yup.string()
            .label(ClientFormFieldLabels[ClientFormFields.village])
            .required(),
        [ClientFormFields.zone]: Yup.number()
            .label(ClientFormFieldLabels[ClientFormFields.zone])
            .required()
            .typeError("Zone is a required field"),
        [ClientFormFields.caregiver_name]: Yup.string()
            .label(ClientFormFieldLabels[ClientFormFields.caregiver_name])
            .max(101),
        [ClientFormFields.caregiver_phone]: Yup.string()
            .label(ClientFormFieldLabels[ClientFormFields.caregiver_phone])
            .max(50)
            .matches(Validation.phoneRegExp, "Phone number is not valid"),
        [ClientFormFields.caregiver_email]: Yup.string()
            .label(ClientFormFieldLabels[ClientFormFields.caregiver_email])
            .max(50)
            .matches(Validation.emailRegExp, "Email Address is not valid"),
    }); */
